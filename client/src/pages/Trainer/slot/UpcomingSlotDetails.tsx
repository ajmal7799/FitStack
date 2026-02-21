import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrainerHeader from "../../../components/trainer/Header";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import { useGetBookedSlotDetails } from "../../../hooks/Trainer/TrainerHooks";
import { useJoinSession } from "../../../hooks/User/userServiceHooks";
import { toast } from "react-hot-toast";

interface SlotDetails {
  _id: string;
  profileImage: string;
  userName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
  cancellationReason?: string | null;
}

const UpcomingSlotDetails = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data, isLoading } = useGetBookedSlotDetails(slotId || "");
  const { mutate: joinSession, isPending: isJoining } = useJoinSession();

  const details: SlotDetails | undefined = data?.data?.result;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = () => {
    if (!slotId) return;
    joinSession(slotId, {
      onSuccess: (response) => {
        const roomId = response?.data?.result?.roomId;
        if (roomId) {
          toast.success("Room found! Joining now...");
          navigate(`/trainer/video-session/${roomId}/${slotId}`);
        } else {
          toast.error("Session is active, but Room ID was not received.");
        }
      },
      onError: (err: any) => {
        const errorMessage = err?.response?.data?.message || "Failed to join session";
        toast.error(errorMessage);
      },
    });
  };

  const getSessionStatus = () => {
    if (!details) return null;
    const start = new Date(details.startTime).getTime();
    const end = new Date(details.endTime).getTime();
    const now = currentTime.getTime();

    if (now < start) {
      const diff = start - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      return {
        label: `Starting in ${hours}h ${mins}m ${secs}s`,
        type: "WAITING",
        disabled: true,
        className: "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
      };
    } else if (now >= start && now <= end) {
      return {
        label: "Enter Video Room",
        type: "LIVE",
        disabled: false,
        className: "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-xl shadow-indigo-200 animate-[pulse_2s_infinite]",
      };
    } else {
      return {
        label: "Session Expired",
        type: "EXPIRED",
        disabled: true,
        className: "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed",
      };
    }
  };

  const status = getSessionStatus();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6FA] text-slate-900 font-sans">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto w-full">

            {/* Back Navigation */}
            <motion.button
              onClick={() => navigate(-1)}
              className="group mb-8 flex items-center text-sm font-bold uppercase tracking-tighter text-slate-400 hover:text-indigo-600 transition-all"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Back to Schedule
            </motion.button>

            <motion.div
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Top Status Bar */}
              <motion.div
                className="px-8 py-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                    details?.slotStatus === "booked"
                      ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    <span className="relative flex h-2 w-2">
                      {details?.slotStatus === "booked" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        details?.slotStatus === "booked" ? "bg-indigo-500" : "bg-slate-400"
                      }`} />
                    </span>
                    {details?.slotStatus === "booked" ? "Confirmed Session" : details?.slotStatus}
                  </div>

                  <span className="h-4 w-px bg-slate-200" />

                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Private 1-on-1 Session
                  </span>
                </div>

                <motion.div
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-mono text-sm font-bold shadow-lg shadow-indigo-100"
                  key={currentTime.getSeconds()}
                  animate={{ opacity: [0.85, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </motion.div>
              </motion.div>

              {/* Main Content */}
              <div className="p-8 lg:p-14">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      className="py-24 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="font-bold text-slate-400 uppercase tracking-tighter text-sm">Syncing Session...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Left: Client Card */}
                      <motion.div
                        className="lg:col-span-5 flex flex-col items-center text-center p-8 rounded-3xl bg-[#F5F6FA] border border-slate-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                      >
                        <motion.div
                          className="relative mb-6"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.35 }}
                        >
                          <img
                            src={details?.profileImage}
                            alt="User"
                            className="w-40 h-40 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                          />
                          {details?.slotStatus === "booked" && (
                            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white" />
                          )}
                        </motion.div>

                        <h3 className="text-2xl font-black tracking-tight mb-1 uppercase text-slate-900">
                          {details?.userName}
                        </h3>
                        <p className="text-slate-400 font-medium mb-8 text-sm tracking-tight">
                          {details?.userEmail}
                        </p>

                        <motion.button
                          className="w-full py-3.5 px-6 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
                          onClick={() => navigate("/trainer/chat")}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Message Client
                        </motion.button>
                      </motion.div>

                      {/* Right: Timeline & Join */}
                      <motion.div
                        className="lg:col-span-7 flex flex-col justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div className="grid grid-cols-2 gap-5 mb-10">
                          <motion.div
                            className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">
                              Check In
                            </p>
                            <p className="text-3xl font-black text-indigo-900">
                              {new Date(details?.startTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-xs text-indigo-400 font-bold uppercase mt-1">
                              {new Date(details?.startTime || "").toLocaleDateString()}
                            </p>
                          </motion.div>

                          <motion.div
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.47 }}
                          >
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                              Check Out
                            </p>
                            <p className="text-3xl font-black text-slate-800">
                              {new Date(details?.endTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                              {new Date(details?.endTime || "").toLocaleDateString()}
                            </p>
                          </motion.div>
                        </div>

                        {/* Dynamic Action Area */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.52 }}
                        >
                          {details?.slotStatus === "cancelled" ? (
                            <div className="bg-red-50 p-7 rounded-2xl border border-red-100">
                              <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">
                                Reason for Cancellation
                              </label>
                              <p className="text-red-800 font-semibold italic leading-relaxed">
                                "{details.cancellationReason || "No reason provided."}"
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <motion.button
                                onClick={handleJoin}
                                disabled={status?.disabled || isJoining}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all border-2 flex items-center justify-center gap-3 ${status?.className}`}
                                whileHover={!status?.disabled ? { scale: 1.02 } : {}}
                                whileTap={!status?.disabled ? { scale: 0.97 } : {}}
                              >
                                {isJoining ? "Connecting..." : status?.label}
                              </motion.button>
                              {status?.type === "WAITING" && (
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                  <span className="w-6 h-px bg-slate-200" />
                                  Waiting for Schedule
                                  <span className="w-6 h-px bg-slate-200" />
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </motion.div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpcomingSlotDetails;