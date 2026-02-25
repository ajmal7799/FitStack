import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrainerHeader from "../../../components/trainer/Header";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import { useGetBookedSlotDetails } from "../../../hooks/Trainer/TrainerHooks";
import { useJoinSession, useCancelBookedSlot } from "../../../hooks/User/userServiceHooks";
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
  cancelledAt?: Date | null;
  cancelledBy?: string | null;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string; bar: string }> = {
  waiting: {
    bg:    "bg-[#faac05]/10 border border-[#faac05]/30",
    text:  "text-[#b87d00]",
    dot:   "bg-[#faac05]",
    label: "Waiting",
    bar:   "bg-[#faac05]",
  },
  booked: {
    bg:    "bg-[#faac05]/10 border border-[#faac05]/30",
    text:  "text-[#b87d00]",
    dot:   "bg-[#faac05]",
    label: "Confirmed",
    bar:   "bg-[#faac05]",
  },
  completed: {
    bg:    "bg-emerald-50 border border-emerald-200",
    text:  "text-emerald-700",
    dot:   "bg-emerald-500",
    label: "Completed",
    bar:   "bg-emerald-500",
  },
  missed: {
    bg:    "bg-orange-50 border border-orange-200",
    text:  "text-orange-600",
    dot:   "bg-orange-400",
    label: "Missed",
    bar:   "bg-orange-400",
  },
  cancelled: {
    bg:    "bg-red-50 border border-red-200",
    text:  "text-red-600",
    dot:   "bg-red-500",
    label: "Cancelled",
    bar:   "bg-red-500",
  },
};

const DEFAULT_STATUS = {
  bg: "bg-gray-100 border border-gray-200", text: "text-gray-500",
  dot: "bg-gray-400", label: "Unknown", bar: "bg-gray-400",
};

// ── Cancel Modal ──────────────────────────────────────────────────────────────
function CancelModal({
  isOpen, onClose, onConfirm, isCancelling,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isCancelling: boolean;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const isEmpty = reason.trim().length === 0;
  const isShort = reason.trim().length < 10;

  useEffect(() => {
    if (!isOpen) { setReason(""); setTouched(false); }
  }, [isOpen]);

  const handleConfirm = () => {
    setTouched(true);
    if (isEmpty || isShort) return;
    onConfirm(reason.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Orange top bar */}
              <div className="h-1.5 w-full bg-[#faac05]" />

              <div className="p-7">
                {/* Icon + title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#faac05]/10 border border-[#faac05]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#faac05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Cancel this session?</h2>
                    <p className="text-sm text-gray-400 font-medium mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>

                {/* Info note */}
                <div className="bg-[#faac05]/5 border border-[#faac05]/20 rounded-2xl p-4 mb-5">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-bold text-gray-700">Before you cancel —</span>{" "}
                    your client will be notified of this cancellation along with the reason you provide. Please ensure you genuinely need to cancel.
                  </p>
                </div>

                {/* Reason textarea */}
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Reason for Cancellation <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter a clear reason for cancellation..."
                    rows={3}
                    className={`w-full resize-none px-4 py-3 rounded-2xl text-sm text-gray-800 placeholder-gray-300 border-2 focus:outline-none transition-all font-medium
                      ${touched && (isEmpty || isShort)
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#faac05] focus:bg-white"
                      }`}
                  />
                  {touched && isEmpty && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-semibold mt-1.5">
                      A reason is required before cancelling.
                    </motion.p>
                  )}
                  {touched && !isEmpty && isShort && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-semibold mt-1.5">
                      Please provide a more descriptive reason (min 10 characters).
                    </motion.p>
                  )}
                  {!isEmpty && !isShort && (
                    <p className="text-xs text-gray-400 font-medium mt-1.5 text-right">{reason.trim().length} characters</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isCancelling}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Keep Session
                  </button>
                  <motion.button
                    onClick={handleConfirm}
                    disabled={isCancelling}
                    whileHover={!isCancelling ? { scale: 1.02 } : {}}
                    whileTap={!isCancelling ? { scale: 0.97 } : {}}
                    className="flex-1 py-3.5 rounded-2xl bg-[#faac05] hover:bg-[#e09b00] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#faac05]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCancelling ? (
                      <>
                        <motion.span
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        />
                        Cancelling...
                      </>
                    ) : "Yes, Cancel"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const UpcomingSlotDetails = () => {
  const { slotId }   = useParams<{ slotId: string }>();
  const navigate     = useNavigate();
  const [currentTime, setCurrentTime]         = useState(new Date());
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data, isLoading }                          = useGetBookedSlotDetails(slotId || "");
  const { mutate: joinSession,  isPending: isJoining }   = useJoinSession();
  const { mutate: cancelSlot,   isPending: isCancelling } = useCancelBookedSlot();

  const details: SlotDetails | undefined = data?.data?.result;
  const statusKey = details?.slotStatus?.toLowerCase() ?? "";
  const cfg       = STATUS_CONFIG[statusKey] ?? DEFAULT_STATUS;

  const isCancelled = statusKey === "cancelled";
  const isCompleted = statusKey === "completed";
  const isMissed    = statusKey === "missed";
  const isTerminal  = isCancelled || isCompleted || isMissed;

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
        toast.error(err?.response?.data?.message || "Failed to join session");
      },
    });
  };

  const handleCancelConfirm = (reason: string) => {
    if (!slotId) return;
    cancelSlot({ slotId, reason }, {
      onSuccess: () => {
        toast.success("Session cancelled successfully.");
        setShowCancelModal(false);
        navigate("/trainer/sessions-history");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to cancel session");
      },
    });
  };

  const getSessionStatus = () => {
    if (!details) return null;
    const start = new Date(details.startTime).getTime();
    const end   = new Date(details.endTime).getTime();
    const now   = currentTime.getTime();

    if (now < start) {
      const diff  = start - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs  = Math.floor((diff % (1000 * 60)) / 1000);
      return { label: `Starting in ${hours}h ${mins}m ${secs}s`, type: "WAITING", disabled: true };
    } else if (now >= start && now <= end) {
      return { label: "Enter Video Room", type: "LIVE", disabled: false };
    } else {
      return { label: "Session Expired", type: "EXPIRED", disabled: true };
    }
  };

  const sessionStatus = getSessionStatus();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-5xl mx-auto w-full">

            {/* Back */}
            <motion.button
              onClick={() => navigate(-1)}
              className="group mb-8 flex items-center text-sm font-bold text-gray-400 hover:text-[#faac05] transition-all"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Back to Schedule
            </motion.button>

            <motion.div
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Status bar — color matches slot status */}
              <div className={`h-1.5 w-full ${cfg.bar}`} />

              {/* Top header */}
              <motion.div
                className="px-6 sm:px-8 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                    <span className="relative flex h-2 w-2">
                      {!isTerminal && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`} />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                    </span>
                    {cfg.label}
                  </span>

                  <span className="h-4 w-px bg-gray-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Private 1-on-1 Session
                  </span>
                </div>

                {/* Live clock */}
                <motion.div
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl font-mono text-sm font-bold"
                  key={currentTime.getSeconds()}
                  animate={{ opacity: [0.85, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </motion.div>
              </motion.div>

              {/* Main content */}
              <div className="p-6 sm:p-8 lg:p-12">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      className="py-24 text-center"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="w-12 h-12 border-4 border-[#faac05]/20 border-t-[#faac05] rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="font-bold text-gray-400 uppercase tracking-tighter text-sm">Syncing Session...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Left: Client card */}
                      <motion.div
                        className="lg:col-span-4 flex flex-col items-center text-center p-7 rounded-3xl bg-gray-50 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                      >
                        <motion.div
                          className="relative mb-5"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.35 }}
                        >
                          <img
                            src={details?.profileImage}
                            alt="User"
                            className="w-36 h-36 rounded-2xl object-cover ring-4 ring-white shadow-md"
                          />
                          {/* Status dot on avatar */}
                          <span className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm ${cfg.dot}`} />
                        </motion.div>

                        <h3 className="text-xl font-black tracking-tight mb-1 text-gray-900 capitalize">
                          {details?.userName}
                        </h3>
                        <p className="text-gray-400 font-medium mb-7 text-sm">{details?.userEmail}</p>

                        {/* Message button */}
                        <motion.button
                          className="w-full py-3 px-6 bg-gray-900 text-white hover:bg-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm mb-2.5"
                          onClick={() => navigate("/trainer/chat")}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Message Client
                        </motion.button>

                        {/* Cancel button — only when session is not terminal */}
                        {!isTerminal && (
                          <motion.button
                            className="w-full py-3 px-6 border-2 border-[#faac05]/40 text-[#b87d00] hover:bg-[#faac05] hover:text-white hover:border-[#faac05] rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            onClick={() => setShowCancelModal(true)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            Cancel Session
                          </motion.button>
                        )}
                      </motion.div>

                      {/* Right: Details + action */}
                      <motion.div
                        className="lg:col-span-8 flex flex-col justify-center gap-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        {/* Time cards */}
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            className="p-5 rounded-2xl bg-[#faac05]/5 border border-[#faac05]/20"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <p className="text-[10px] font-black text-[#b87d00] uppercase tracking-widest mb-2">Check In</p>
                            <p className="text-3xl font-black text-gray-900">
                              {new Date(details?.startTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                              {new Date(details?.startTime || "").toLocaleDateString()}
                            </p>
                          </motion.div>

                          <motion.div
                            className="p-5 rounded-2xl bg-gray-50 border border-gray-100"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.47 }}
                          >
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Check Out</p>
                            <p className="text-3xl font-black text-gray-800">
                              {new Date(details?.endTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                              {new Date(details?.endTime || "").toLocaleDateString()}
                            </p>
                          </motion.div>
                        </div>

                        {/* ── Terminal status banners ── */}

                        {/* CANCELLED */}
                        {isCancelled && (
                          <motion.div
                            className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-3"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-wider">
                              <span>🚫</span> Session Cancelled
                            </div>
                            {details?.cancellationReason && (
                              <div>
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Reason</p>
                                <p className="text-red-700 font-medium text-sm italic">"{details.cancellationReason}"</p>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-6 pt-1">
                              {details?.cancelledBy && (
                                <div>
                                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Cancelled By</p>
                                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize ${details.cancelledBy === "user" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                                    {details.cancelledBy}
                                  </span>
                                </div>
                              )}
                              {details?.cancelledAt && (
                                <div>
                                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Cancelled At</p>
                                  <p className="text-red-700 font-medium text-sm">
                                    {new Date(details.cancelledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* COMPLETED */}
                        {isCompleted && (
                          <motion.div
                            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-3"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl">✅</span>
                            <div>
                              <p className="text-emerald-700 font-black text-sm">Session Completed</p>
                              <p className="text-emerald-600 text-xs mt-0.5">This session was successfully completed.</p>
                            </div>
                          </motion.div>
                        )}

                        {/* MISSED */}
                        {isMissed && (
                          <motion.div
                            className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-3"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl">⚠️</span>
                            <div>
                              <p className="text-orange-700 font-black text-sm">Session Missed</p>
                              <p className="text-orange-600 text-xs mt-0.5">The client did not attend this session.</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Join / countdown — only for non-terminal */}
                        {!isTerminal && (
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.52 }}
                          >
                            <motion.button
                              onClick={handleJoin}
                              disabled={sessionStatus?.disabled || isJoining}
                              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.12em] text-sm transition-all flex items-center justify-center gap-3 border-2
                                ${sessionStatus?.type === "LIVE"
                                  ? "bg-[#faac05] hover:bg-[#e09b00] text-white border-transparent shadow-xl shadow-[#faac05]/25 animate-pulse"
                                  : sessionStatus?.type === "EXPIRED"
                                  ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                }`}
                              whileHover={!sessionStatus?.disabled ? { scale: 1.02 } : {}}
                              whileTap={!sessionStatus?.disabled ? { scale: 0.97 } : {}}
                            >
                              {isJoining ? "Connecting..." : sessionStatus?.label}
                            </motion.button>

                            {sessionStatus?.type === "WAITING" && (
                              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <span className="w-6 h-px bg-gray-200" />
                                Waiting for Schedule
                                <span className="w-6 h-px bg-gray-200" />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
      />
    </div>
  );
};

export default UpcomingSlotDetails;