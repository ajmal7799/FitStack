import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socketService } from "../../service/socket/socket";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import Peer from "simple-peer";
import type { Rootstate } from "../../redux/store";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

const VideoSessionPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { slotId } = useParams<{ slotId: string }>();

  const userId      = useSelector((state: Rootstate) => state.authData._id);
  const token       = useSelector((state: Rootstate) => state.authData.accessToken);
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const connectionRef  = useRef<Peer.Instance | null>(null);
  const hasAnswered    = useRef(false);
  const isTearingDown  = useRef(false); // ✅ Guard against double teardown

  const [stream,            setStream]            = useState<MediaStream | null>(null);
  const [isMuted,           setIsMuted]           = useState(false);
  const [isVideoOff,        setIsVideoOff]        = useState(false);
  const [isPartnerPresent,  setIsPartnerPresent]  = useState(false);
  const [partnerLeft,       setPartnerLeft]       = useState(false);

  // ✅ Single teardown function — always called in the same order
  const teardown = useCallback((shouldNavigate = true) => {
  if (isTearingDown.current) return;
  isTearingDown.current = true;

  if (localVideoRef.current?.srcObject) {
    (localVideoRef.current.srcObject as MediaStream)
      .getTracks().forEach(track => track.stop());
    localVideoRef.current.srcObject = null;
  }

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }

  if (connectionRef.current) {
    connectionRef.current.destroy();
    connectionRef.current = null;
  }

  hasAnswered.current = false;

  if (roomId) socketService.leaveVideoRoom(roomId);

  // ✅ Invalidate BEFORE navigating so details page gets fresh data immediately
  queryClient.invalidateQueries({ queryKey: ["bookedSlots"] });
  queryClient.invalidateQueries({ queryKey: ["bookedSlotDetails", slotId] });

  if (shouldNavigate) {
    // ✅ Small delay so invalidation settles before page transition
    setTimeout(() => navigate(-1), 100);
  }
}, [roomId, slotId, navigate, queryClient]);

useEffect(() => {
  if (!userId || !roomId) return;

  let currentStream: MediaStream | null = null;

  const initSession = async () => {
    try {
      currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(currentStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = currentStream;
      }

      if (!socketService.isConnected()) {
        socketService.connect(token, userId);
      }

      socketService.joinVideoRoom(roomId, userId, slotId as string);

      socketService.onPeerJoined(() => {
        // ✅ Reset ALL state — handles both first join AND rejoin
        setIsPartnerPresent(true);
        setPartnerLeft(false);        // ✅ clear "partner left" overlay on rejoin
        hasAnswered.current = false;  // ✅ reset so handshake can happen again

        // Destroy stale peer before creating new one
        if (connectionRef.current) {
          connectionRef.current.destroy();
          connectionRef.current = null;
        }

        if (currentStream) initiateCall(currentStream);
      });

      socketService.onReceiveSignal((signalData: any) => {
        // ✅ Reset partner state when we receive a signal (they're back)
        setIsPartnerPresent(true);
        setPartnerLeft(false); // ✅ clear overlay if they rejoined and sent signal first

        if (!connectionRef.current && !hasAnswered.current) {
          hasAnswered.current = true;
          answerCall(signalData, currentStream!);
        } else if (connectionRef.current) {
          const peer = connectionRef.current as any;
          const signalingState = peer._pc?.signalingState;
          if (signalingState && signalingState !== "stable") {
            connectionRef.current.signal(signalData);
          }
        }
      });

      // ✅ Partner left — only update UI, keep stream alive for potential rejoin
      socketService.onPeerLeft(() => {
        setIsPartnerPresent(false);
        setPartnerLeft(true);

        // Clear remote video
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }

        // Destroy peer but reset hasAnswered so rejoin handshake works
        if (connectionRef.current) {
          connectionRef.current.destroy();
          connectionRef.current = null;
        }
        hasAnswered.current = false; // ✅ critical — allows fresh handshake on rejoin
      });

      // ✅ Both fully left → server confirmed session complete → navigate
      socketService.onSessionCompleted(({ slotId: completedSlotId }) => {
        console.log("✅ Session completed for slot:", completedSlotId);
        queryClient.invalidateQueries({ queryKey: ["bookedSlotDetails", completedSlotId] });
        queryClient.invalidateQueries({ queryKey: ["bookedSlots"] });
        teardown(true);
      });

    } catch (err) {
      console.error("Media Error:", err);
    }
  };

  initSession();

  return () => {
    if (!isTearingDown.current) {
      currentStream?.getTracks().forEach(track => track.stop());
      connectionRef.current?.destroy();
      connectionRef.current = null;
      hasAnswered.current = false;
      isTearingDown.current = false;
      if (roomId) socketService.leaveVideoRoom(roomId);
    }
  };
}, [roomId, userId, token]);

  const initiateCall = (myStream: MediaStream) => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    const peer = new Peer({ initiator: true, trickle: false, stream: myStream });

    peer.on("signal", (data) => socketService.sendSignal(roomId!, data));
    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });
    peer.on("error", (err) => console.error("Peer error:", err));
    peer.on("close", () => setIsPartnerPresent(false));

    connectionRef.current = peer;
  };

  const answerCall = (incomingSignal: any, myStream: MediaStream) => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    const peer = new Peer({ initiator: false, trickle: false, stream: myStream });

    peer.on("signal", (data) => socketService.sendSignal(roomId!, data));
    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });
    peer.on("error", (err) => console.error("Peer error:", err));
    peer.on("close", () => setIsPartnerPresent(false));

    peer.signal(incomingSignal);
    connectionRef.current = peer;
  };

  const toggleMute = () => {
    if (stream) {
      const enabled = stream.getAudioTracks()[0].enabled;
      stream.getAudioTracks()[0].enabled = !enabled;
      setIsMuted(enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const enabled = stream.getVideoTracks()[0].enabled;
      stream.getVideoTracks()[0].enabled = !enabled;
      setIsVideoOff(enabled);
    }
  };

  // ✅ End call — just calls teardown
  const handleEndCall = () => teardown(true);

  return (
    <div className="relative h-screen w-screen bg-zinc-950 overflow-hidden font-sans text-white">

      {/* REMOTE VIDEO */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="h-full w-full object-contain"
        />

        {/* Partner left overlay */}
        {partnerLeft && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-md z-10">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <PhoneOff size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold tracking-wide text-white">
              Partner has left
            </h2>
            <p className="text-zinc-400 mt-2 text-sm">Returning to schedule...</p>
          </div>
        )}

        {/* Waiting overlay */}
        {!isPartnerPresent && !partnerLeft && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md z-10">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-medium tracking-wide">Waiting for partner...</h2>
            <p className="text-zinc-400 mt-2 text-sm">The session will begin as soon as they join.</p>
          </div>
        )}
      </div>

      {/* LOCAL VIDEO (PIP) */}
      <div className="absolute bottom-24 right-6 w-48 md:w-72 aspect-video rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 bg-zinc-800">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover -scale-x-100 ${isVideoOff ? "hidden" : "block"}`}
        />
        {isVideoOff && (
          <div className="h-full w-full flex items-center justify-center bg-zinc-800">
            <VideoOff size={32} className="text-zinc-500" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] font-medium uppercase">
          You
        </div>
      </div>

      {/* TOP STATUS BAR */}
      <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/30 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 z-30">
        <div className={`w-2 h-2 rounded-full ${isPartnerPresent ? "bg-green-500 animate-pulse" : "bg-zinc-500"}`} />
        <span className="text-sm font-medium">
          {partnerLeft ? "Session Ended" : isPartnerPresent ? "Session Active" : "Waiting Room"}
        </span>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 px-6 py-4 bg-zinc-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
        <button
          onClick={toggleMute}
          disabled={partnerLeft}
          className={`p-4 rounded-full transition-all disabled:opacity-40 ${isMuted ? "bg-red-500" : "bg-zinc-800 hover:bg-zinc-700"}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          disabled={partnerLeft}
          className={`p-4 rounded-full transition-all disabled:opacity-40 ${isVideoOff ? "bg-red-500" : "bg-zinc-800 hover:bg-zinc-700"}`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-4 bg-red-600 rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
};

export default VideoSessionPage;