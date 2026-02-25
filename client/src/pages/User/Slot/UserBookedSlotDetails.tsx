import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetBookedSlotDetails, useCancelBookedSlot, useJoinSession, useFeedback } from "../../../hooks/User/userServiceHooks";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SlotDetails {
  _id: string;
  profileImage: string;
  trainerName: string;
  trainerEmail: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: "user" | "trainer" | string;
  hasFeedback: boolean;
  feedback: {
    _id: string;
    rating: number;
    review?: string;
    createdAt?: Date;
  } | null;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  waiting:   { label: "Waiting",   className: "bg-yellow-100 text-yellow-700" },
  live:      { label: "Live",      className: "bg-green-100 text-green-700 animate-pulse" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  missed:    { label: "Missed",    className: "bg-orange-100 text-orange-600" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600" },
};

// ── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-all duration-150 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <span className={
            star <= (hovered || value)
              ? "text-yellow-400"
              : "text-gray-200"
          }>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Feedback Form ─────────────────────────────────────────────────────────────
function FeedbackForm({
  slotId,
  trainerName,
  onSuccess,
}: {
  slotId: string;
  trainerName: string;
  onSuccess: () => void;
}) {
  const [rating, setRating]   = useState(0);
  const [review, setReview]   = useState("");
  const [touched, setTouched] = useState(false);

  const { mutate: submitFeedback, isPending } = useFeedback();

  const handleSubmit = () => {
    setTouched(true);
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    submitFeedback(
      { sessionId: slotId, rating, review },
      {
        onSuccess: () => {
          toast.success("Feedback submitted!");
          onSuccess();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to submit feedback");
        },
      }
    );
  };

  return (
    <motion.div
      className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">💬</span>
        <div>
          <p className="text-blue-800 font-bold text-sm">Rate your session</p>
          <p className="text-blue-500 text-xs">How was your session with {trainerName}?</p>
        </div>
      </div>

      {/* Stars */}
      <div>
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
          Rating <span className="text-red-400">*</span>
        </p>
        <StarRating value={rating} onChange={setRating} />
        {touched && rating === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 font-semibold mt-1"
          >
            Please select a rating.
          </motion.p>
        )}
      </div>

      {/* Review */}
      <div>
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
          Review <span className="text-gray-400 normal-case font-normal">(optional)</span>
        </p>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience... (optional)"
          rows={3}
          className="w-full resize-none px-4 py-3 rounded-xl text-sm text-gray-700 placeholder-gray-300 border border-blue-100 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
        />
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={!isPending ? { scale: 1.02 } : {}}
        whileTap={!isPending ? { scale: 0.97 } : {}}
      >
        {isPending ? (
          <>
            <motion.span
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
            Submitting...
          </>
        ) : (
          "Submit Feedback"
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Existing Feedback Display ─────────────────────────────────────────────────
function FeedbackDisplay({
  feedback,
}: {
  feedback: NonNullable<SlotDetails["feedback"]>;
}) {
  return (
    <motion.div
      className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">⭐</span>
        <p className="text-green-700 font-bold text-sm">Your Feedback</p>
      </div>

      <StarRating value={feedback.rating} readonly />

      {feedback.review && (
        <p className="text-green-800 text-sm italic">"{feedback.review}"</p>
      )}

      {feedback.createdAt && (
        <p className="text-green-500 text-xs">
          Submitted on{" "}
          {new Date(feedback.createdAt).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const UserBookedSlotDetails = () => {
  const { slotId }   = useParams<{ slotId: string }>();
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [cancelReason,  setCancelReason]  = useState("");
  const [currentTime,   setCurrentTime]   = useState(new Date());

  const { data, isLoading }                          = useGetBookedSlotDetails(slotId || "");
  const { mutate: cancelSlot,  isPending: isCancelling } = useCancelBookedSlot();
  const { mutate: joinSession, isPending: isJoining }    = useJoinSession();

  const details: SlotDetails | undefined = data?.data?.result;

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
          navigate("/sessions-history");
        },
      }
    );
  };

  // Invalidate query so feedback section refreshes after submission
  const handleFeedbackSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["bookedSlotDetails", slotId] });
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
      return { label: `Starts in ${hours}h ${mins}m ${secs}s`, type: "WAITING", disabled: true };
    } else if (now >= start && now <= end) {
      return { label: "Join Session Now", type: "LIVE", disabled: false };
    } else {
      return { label: "Session Expired", type: "EXPIRED", disabled: true };
    }
  };

  const sessionStatus = getSessionStatus();
  const statusKey  = details?.slotStatus?.toLowerCase() ?? "";
  const badge      = STATUS_BADGE[statusKey] ?? { label: details?.slotStatus ?? "—", className: "bg-gray-100 text-gray-500" };
  const isCancelled = statusKey === "cancelled";
  const isCompleted = statusKey === "completed";
  const isMissed    = statusKey === "missed";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-10">

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
            {/* Header Banner */}
            <div className={`p-8 flex items-center justify-between text-white ${
              isCancelled ? "bg-red-500" : isCompleted ? "bg-green-600" : isMissed ? "bg-orange-500" : "bg-blue-600"
            }`}>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Booking Overview</h2>
                <p className="text-white/70 text-sm mt-1">Video Session Details</p>
              </div>
              <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${badge.className}`}>
                {badge.label}
              </span>
            </div>

            <div className="p-6 sm:p-10">
              {isLoading ? (
                <div className="flex flex-col items-center py-20 gap-3 text-blue-400">
                  <motion.div
                    className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-sm font-medium">Loading session details...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                  {/* Trainer Info */}
                  <motion.div
                    className="lg:col-span-4 flex flex-col items-center text-center space-y-5 lg:border-r border-gray-100 lg:pr-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    <motion.img
                      src={details?.profileImage}
                      alt="Trainer"
                      className="w-36 h-36 rounded-2xl object-cover border-4 border-blue-50 shadow-lg"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.35 }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{details?.trainerName}</h3>
                      <p className="text-gray-500 font-medium text-sm">{details?.trainerEmail}</p>
                    </div>
                  </motion.div>

                  {/* Session Details */}
                  <motion.div
                    className="lg:col-span-8 space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {/* Time Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Scheduled Start</label>
                        <p className="text-blue-900 font-bold text-lg">{new Date(details?.startTime || "").toLocaleDateString()}</p>
                        <p className="text-blue-600 font-medium">{new Date(details?.startTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </motion.div>
                      <motion.div
                        className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.47 }}
                      >
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Scheduled End</label>
                        <p className="text-blue-900 font-bold text-lg">{new Date(details?.endTime || "").toLocaleDateString()}</p>
                        <p className="text-blue-600 font-medium">{new Date(details?.endTime || "").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </motion.div>
                    </div>

                    {/* CANCELLED */}
                    <AnimatePresence>
                      {isCancelled && (
                        <motion.div
                          className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-3"
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
                            <span>🚫</span> Session Cancelled
                          </div>
                          {details?.cancellationReason && (
                            <div>
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em] mb-1">Reason</p>
                              <p className="text-red-700 font-medium text-sm">{details.cancellationReason}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-6 pt-1">
                            {details?.cancelledBy && (
                              <div>
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em] mb-1">Cancelled By</p>
                                <span className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize ${details.cancelledBy === "trainer" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                                  {details.cancelledBy}
                                </span>
                              </div>
                            )}
                            {details?.cancelledAt && (
                              <div>
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em] mb-1">Cancelled At</p>
                                <p className="text-red-700 font-medium text-sm">
                                  {new Date(details.cancelledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* COMPLETED — show banner + feedback section */}
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          {/* Completed banner */}
                          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                              <p className="text-green-700 font-bold text-sm">Session Completed</p>
                              <p className="text-green-600 text-xs">This session has been successfully completed.</p>
                            </div>
                          </div>

                          {/* ── Feedback section ── */}
                          {details?.hasFeedback ? (
                            // hasFeedback = true → no feedback yet → show form
                            <FeedbackForm
                              slotId={slotId || ""}
                              trainerName={details.trainerName}
                              onSuccess={handleFeedbackSuccess}
                            />
                          ) : details?.feedback ? (
                            // hasFeedback = false + feedback exists → show submitted feedback
                            <FeedbackDisplay feedback={details.feedback} />
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* MISSED */}
                    <AnimatePresence>
                      {isMissed && (
                        <motion.div
                          className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-3"
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <p className="text-orange-700 font-bold">Session Missed</p>
                            <p className="text-orange-600 text-sm">You missed this session. Please book a new slot.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Join / countdown */}
                    {!isCancelled && !isCompleted && !isMissed && (
                      <motion.div
                        className="pt-4 border-t border-gray-100"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.52 }}
                      >
                        <div className="space-y-3">
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
                            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                              Button will activate at start time
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Action buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-3 pt-2"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.58 }}
                    >
                      <motion.button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm"
                        onClick={() => navigate("/chat")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Chat with Trainer
                      </motion.button>
                      {!isCancelled && !isCompleted && !isMissed && sessionStatus?.type === "WAITING" && (
                        <motion.button
                          onClick={() => setIsModalOpen(true)}
                          className="flex-1 border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-all text-sm"
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <p className="text-gray-400 text-sm mb-4">Please let us know why you want to cancel this session.</p>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Enter reason..."
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 border border-gray-100"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  Go Back
                </motion.button>
                <motion.button
                  onClick={handleCancelSubmit}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg disabled:opacity-60"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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