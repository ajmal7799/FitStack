import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetBookedSlotDetails, useCancelBookedSlot, useJoinSession } from "../../../hooks/User/userServiceHooks";
import { toast } from "react-hot-toast";

interface SlotDetails {
  _id: string;
  profileImage: string;
  trainerName: string;
  trainerEmail: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const UserBookedSlotDetails = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data, isLoading } = useGetBookedSlotDetails(slotId || "");
  const { mutate: cancelSlot, isPending: isCancelling } = useCancelBookedSlot();
  const { mutate: joinSession, isPending: isJoining } = useJoinSession();

  const details: SlotDetails | undefined = data?.data?.result;

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = () => {
    if (!slotId) return;
    joinSession(slotId, {
      onSuccess: (data) => {
        const roomId = data?.data?.result?.roomId;
        if (roomId) {
          toast.success("Joining session...");
          navigate(`/video-session/${roomId}/${slotId}`);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Could not join session");
      },
    });
  };

  const handleCancelSubmit = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    cancelSlot(
      { slotId: slotId || "", reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Cancelled successfully");
          setIsModalOpen(false);
          navigate(-1);
        },
      }
    );
  };

  // Session Logic Helper
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
      return { label: `Starts in ${hours}h ${mins}m ${secs}s`, type: "WAITING", disabled: true };
    } else if (now >= start && now <= end) {
      return { label: "Join Session Now", type: "LIVE", disabled: false };
    } else {
      return { label: "Session Expired", type: "EXPIRED", disabled: true };
    }
  };

  const sessionStatus = getSessionStatus();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-10">

          <motion.button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="mr-2">←</span> Back to Bookings
          </motion.button>

          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md border border-blue-100 overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-blue-600 p-8 flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Booking Overview</h2>
                <p className="text-blue-100 text-sm mt-1">Video Session Details</p>
              </div>
              <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${details?.slotStatus === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-white text-blue-600'}`}>
                {details?.slotStatus || "Processing..."}
              </span>
            </div>

            <div className="p-10">
              {isLoading ? (
                <div className="text-center py-20 text-blue-500 font-medium">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                  {/* Trainer Info */}
                  <motion.div
                    className="lg:col-span-4 flex flex-col items-center text-center space-y-5 border-r border-gray-50 pr-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    <motion.img
                      src={details?.profileImage}
                      alt="Trainer"
                      className="w-40 h-40 rounded-2xl object-cover border-4 border-blue-50 shadow-lg"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.35 }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{details?.trainerName}</h3>
                      <p className="text-gray-500 font-medium">{details?.trainerEmail}</p>
                    </div>
                  </motion.div>

                  {/* Session Details */}
                  <motion.div
                    className="lg:col-span-8 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div
                        className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Scheduled Start</label>
                        <p className="text-blue-900 font-bold text-lg">{new Date(details?.startTime || "").toLocaleDateString()}</p>
                        <p className="text-blue-600 font-medium">{new Date(details?.startTime || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </motion.div>
                      <motion.div
                        className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.47 }}
                      >
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Scheduled End</label>
                        <p className="text-blue-900 font-bold text-lg">{new Date(details?.endTime || "").toLocaleDateString()}</p>
                        <p className="text-blue-600 font-medium">{new Date(details?.endTime || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </motion.div>
                    </div>

                    {/* Join Session Logic */}
                    <motion.div
                      className="pt-6 border-t border-gray-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.52 }}
                    >
                      {details?.slotStatus !== 'cancelled' ? (
                        <div className="space-y-4">
                          <motion.button
                            onClick={handleJoin}
                            disabled={sessionStatus?.disabled || isJoining}
                            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                              sessionStatus?.type === "LIVE"
                                ? "bg-green-600 hover:bg-green-700 animate-pulse"
                                : sessionStatus?.type === "EXPIRED"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-400 cursor-not-allowed"
                            }`}
                            whileHover={!sessionStatus?.disabled ? { scale: 1.02 } : {}}
                            whileTap={!sessionStatus?.disabled ? { scale: 0.97 } : {}}
                          >
                            {isJoining ? "Connecting..." : sessionStatus?.label}
                          </motion.button>

                          {sessionStatus?.type === "WAITING" && (
                            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Button will activate at start time</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-red-50 p-4 rounded-xl text-red-600 text-center font-bold">Session Cancelled</div>
                      )}
                    </motion.div>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.58 }}
                    >
                      <motion.button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                        onClick={() => navigate("/chat")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Chat with Trainer
                      </motion.button>
                      {details?.slotStatus !== 'cancelled' && sessionStatus?.type === "WAITING" && (
                        <motion.button
                          onClick={() => setIsModalOpen(true)}
                          className="flex-1 border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Cancel Booking
                        </motion.button>
                      )}
                    </motion.div>
                  </motion.div>

                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Cancel Booking?</h3>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter reason..."
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex gap-3 mt-8">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Go Back
                </motion.button>
                <motion.button
                  onClick={handleCancelSubmit}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isCancelling ? "Processing..." : "Confirm Cancel"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBookedSlotDetails;