import  { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socketService } from "../../service/socket/socket";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import Peer from "simple-peer";
import type { Rootstate } from "../../redux/store";
import { useSelector } from "react-redux";

const VideoSessionPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {slotId} = useParams<{slotId: string}>();
  
  // ✅ All hooks at top level — never inside functions
  const userId = useSelector((state: Rootstate) => state.authData._id);
  const token = useSelector((state: Rootstate) => state.authData.accessToken);
  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const hasAnswered = useRef(false); // ✅ Guard against double answerCall

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isPartnerPresent, setIsPartnerPresent] = useState(false);

  useEffect(() => {
    if (!userId || !roomId) {
      console.error("Missing ID:", { userId, roomId });
      return;
    }

    let currentStream: MediaStream | null = null;

    const initSession = async () => {
      try {
        // 1. Get user media
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = currentStream;
        }

        // 2. Ensure socket is connected
        if (!socketService.isConnected()) {
          socketService.connect(token, userId);
        }

        // 3. Join video room
        socketService.joinVideoRoom(roomId, userId, slotId as string);

        // 4. Listen: partner joined — we become the caller
        socketService.onPeerJoined(() => {
          console.log('👥 Peer joined, initiating call...');
          setIsPartnerPresent(true);
          if (currentStream) initiateCall(currentStream);
        });

        // 5. Listen: incoming signal from partner
        socketService.onReceiveSignal((signalData: any) => {
          setIsPartnerPresent(true);

          if (!connectionRef.current && !hasAnswered.current) {
            // ✅ First signal received — we are the receiver
            console.log('📡 Received first signal, answering call...');
            hasAnswered.current = true;
            answerCall(signalData, currentStream!);
          } else if (connectionRef.current) {
            // ✅ Subsequent signals — only pass if peer is not in stable state
            const peer = connectionRef.current as any;
            const signalingState = peer._pc?.signalingState;
            if (signalingState && signalingState !== 'stable') {
              console.log('📡 Passing additional signal to peer...');
              connectionRef.current.signal(signalData);
            } else {
              console.log('⚠️ Ignoring signal, peer already stable');
            }
          }
        });

      } catch (err) {
        console.error("Media Error:", err);
      }
    };

    initSession();

    return () => {
      // ✅ Full cleanup
      currentStream?.getTracks().forEach((track) => track.stop());
      connectionRef.current?.destroy();
      connectionRef.current = null;
      hasAnswered.current = false;
      if (roomId) socketService.leaveVideoRoom(roomId);
    };
  }, [roomId, userId, token]);

  // ─── WebRTC Logic ─────────────────────────────────────────────

  const initiateCall = (myStream: MediaStream) => {
    // ✅ Destroy existing peer before creating new one
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myStream,
    });

    peer.on("signal", (data) => {
      console.log('📤 Sending signal as caller...');
      socketService.sendSignal(roomId!, data);
    });

    peer.on("stream", (remoteStream) => {
      console.log('🎥 Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      setIsPartnerPresent(false);
    });

    connectionRef.current = peer;
  };

  const answerCall = (incomingSignal: any, myStream: MediaStream) => {
    // ✅ Destroy existing peer before creating new one
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myStream,
    });

    peer.on("signal", (data) => {
      console.log('📤 Sending signal as receiver...');
      socketService.sendSignal(roomId!, data);
    });

    peer.on("stream", (remoteStream) => {
      console.log('🎥 Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      setIsPartnerPresent(false);
    });

    peer.signal(incomingSignal);
    connectionRef.current = peer;
  };

  // ─── Controls ─────────────────────────────────────────────────

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

  const handleEndCall = () => {
    connectionRef.current?.destroy();
    connectionRef.current = null;
    stream?.getTracks().forEach((track) => track.stop());
    if (roomId) socketService.leaveVideoRoom(roomId);
    navigate(-1);
  };

  // ─── Render ───────────────────────────────────────────────────

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
        {!isPartnerPresent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md z-10">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-medium tracking-wide">
              Waiting for partner...
            </h2>
            <p className="text-zinc-400 mt-2 text-sm">
              The session will begin as soon as they join.
            </p>
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
          className={`h-full w-full object-cover -scale-x-100 ${
            isVideoOff ? "hidden" : "block"
          }`}
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
        <div
          className={`w-2 h-2 rounded-full ${
            isPartnerPresent ? "bg-green-500 animate-pulse" : "bg-zinc-500"
          }`}
        ></div>
        <span className="text-sm font-medium">
          {isPartnerPresent ? "Session Active" : "Waiting Room"}
        </span>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 px-6 py-4 bg-zinc-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all ${
            isMuted ? "bg-red-500" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoOff ? "bg-red-500" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
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