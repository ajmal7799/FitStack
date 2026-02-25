import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import TrainerHeader from "../../../components/trainer/Header";
import Pagination from "../../../components/pagination/Pagination";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetBookedSlots } from "../../../hooks/Trainer/TrainerHooks";

// ── Constants ────────────────────────────────────────────────────────────────
const SessionStatus = {
  COMPLETED: "completed",
  MISSED:    "missed",
  CANCELLED: "cancelled",
  WAITING:   "waiting",
} as const;

type SessionStatusValue = typeof SessionStatus[keyof typeof SessionStatus];

const LIMIT = 4;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  waiting: {
    bg:    "bg-[#faac05]/10 border border-[#faac05]/30",
    text:  "text-[#b87d00]",
    dot:   "bg-[#faac05]",
    label: "Waiting",
  },
  booked: {
    bg:    "bg-[#faac05]/10 border border-[#faac05]/30",
    text:  "text-[#b87d00]",
    dot:   "bg-[#faac05]",
    label: "Booked",
  },
  completed: {
    bg:    "bg-emerald-100 border border-emerald-200",
    text:  "text-emerald-700",
    dot:   "bg-emerald-500",
    label: "Completed",
  },
  missed: {
    bg:    "bg-amber-100 border border-amber-200",
    text:  "text-amber-700",
    dot:   "bg-amber-500",
    label: "Missed",
  },
  cancelled: {
    bg:    "bg-red-100 border border-red-200",
    text:  "text-red-700",
    dot:   "bg-red-500",
    label: "Cancelled",
  },
};

const DEFAULT_STATUS = {
  bg: "bg-gray-100 border border-gray-200", text: "text-gray-600", dot: "bg-gray-400", label: "Unknown",
};

// ── Filter options ────────────────────────────────────────────────────────────
const filterOptions: { label: string; value: SessionStatusValue | undefined }[] = [
  { label: "All",       value: undefined },
  { label: "Waiting",   value: SessionStatus.WAITING },
  { label: "Completed", value: SessionStatus.COMPLETED },
  { label: "Missed",    value: SessionStatus.MISSED },
  { label: "Cancelled", value: SessionStatus.CANCELLED },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookedSlot {
  _id: string;
  userName: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getDuration(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  return `${m} min`;
}

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit:   { opacity: 0, x: -24, transition: { duration: 0.18 } },
};

// ── Details icon ──────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// ── Shared states ─────────────────────────────────────────────────────────────
const EmptyState = ({ filter }: { filter?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-600">No slots found{filter ? ` for "${filter}"` : ""}</p>
    <p className="text-xs mt-1 text-gray-400">Try a different filter or check back later.</p>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-600">Failed to load upcoming slots</p>
    <p className="text-xs mt-1 text-gray-400">Please try again.</p>
  </div>
);

// ── Mobile Card ───────────────────────────────────────────────────────────────
function SlotCard({
  slot, index, page, onDetails,
}: {
  slot: BookedSlot;
  index: number;
  page: number;
  onDetails: (id: string) => void;
}) {
  const cfg    = STATUS_CONFIG[slot.slotStatus?.toLowerCase()] ?? DEFAULT_STATUS;
  const rowNum = (page - 1) * LIMIT + index + 1;

  return (
    <motion.div
      variants={itemVariants}
      exit="exit"
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">
            {rowNum}
          </span>
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
            {slot.userName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-900 capitalize truncate">
            {slot.userName}
          </span>
        </div>
        <button
          onClick={() => onDetails(slot._id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faac05] hover:bg-[#e09b00] text-white text-xs font-bold transition-all duration-200 flex-shrink-0 shadow-sm"
        >
          <EyeIcon />
          Details
        </button>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-8">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
          <p className="text-sm text-gray-700">{formatDate(slot.startTime)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Duration</p>
          <p className="text-sm text-gray-700">{getDuration(slot.startTime, slot.endTime)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
          <p className="text-sm text-gray-700">
            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const UpcomingSlotsPage = () => {
  const navigate = useNavigate();
  const [currentPage,  setCurrentPage]  = useState(1);
  const [activeFilter, setActiveFilter] = useState<SessionStatusValue | undefined>(undefined);

  const { data, isLoading, isError } = useGetBookedSlots(currentPage, LIMIT, activeFilter);

  const slots: BookedSlot[] = data?.data?.result?.slots      || [];
  const totalPages: number  = data?.data?.result?.totalePages || 1;
  const totalSlots: number  = data?.data?.result?.totalSlots  || 0;

  const handleFilterChange = (value: SessionStatusValue | undefined) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const handleDetails = (slotId: string) => {
    if (!slotId) return;
    navigate(`/trainer/upcoming-slots/${slotId}`);
  };

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Upcoming Slots
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and view your scheduled appointments.
              </p>
            </div>

            {/* Total badge */}
            {!isLoading && !isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm self-start sm:self-auto"
              >
                <div className="w-2 h-2 rounded-full bg-[#faac05] animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">
                  {totalSlots} appointment{totalSlots !== 1 ? "s" : ""}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* ── Filter Pills ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex gap-2 mb-5 flex-wrap"
          >
            {filterOptions.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleFilterChange(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                  ${activeFilter === value
                    ? "bg-[#faac05] text-white border-[#faac05] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#faac05]/60 hover:text-[#b87d00]"
                  }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* ── DESKTOP TABLE (md+) ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Light gray header — matching TrainerSessionHistoryPage */}
            <div className="grid grid-cols-[40px_1fr_1.4fr_1fr_80px_110px_110px] px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider gap-4">
              <span>#</span>
              <span>Client</span>
              <span>Date</span>
              <span>Time</span>
              <span>Dur.</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="divide-y divide-gray-50">
                {Array(LIMIT).fill(null).map((_, i) => (
                  <div key={i} className="grid grid-cols-[40px_1fr_1.4fr_1fr_80px_110px_110px] px-6 py-4 gap-4 animate-pulse items-center">
                    {Array(7).fill(null).map((__, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && <ErrorState />}
            {!isLoading && !isError && slots.length === 0 && <EmptyState filter={activeFilter} />}

            {/* Data rows */}
            {!isLoading && !isError && slots.length > 0 && (
              <motion.div
                key={`desktop-${currentPage}-${activeFilter}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-50"
              >
                <AnimatePresence mode="popLayout">
                  {slots.map((slot, index) => {
                    const cfg    = STATUS_CONFIG[slot.slotStatus?.toLowerCase()] ?? DEFAULT_STATUS;
                    const rowNum = (currentPage - 1) * LIMIT + index + 1;

                    return (
                      <motion.div
                        key={slot._id}
                        variants={itemVariants}
                        exit="exit"
                        className="grid grid-cols-[40px_1fr_1.4fr_1fr_80px_110px_110px] px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 gap-4"
                      >
                        {/* # */}
                        <span className="text-sm font-medium text-gray-400">{rowNum}</span>

                        {/* Client */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                            {slot.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 capitalize truncate">
                            {slot.userName}
                          </span>
                        </div>

                        {/* Date */}
                        <span className="text-sm text-gray-600 truncate">
                          {formatDate(slot.startTime)}
                        </span>

                        {/* Time */}
                        <span className="text-sm text-gray-600 truncate">
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </span>

                        {/* Duration */}
                        <span className="text-sm text-gray-600">
                          {getDuration(slot.startTime, slot.endTime)}
                        </span>

                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          {cfg.label}
                        </span>

                        {/* Details button — #faac05 */}
                        <button
                          onClick={() => handleDetails(slot._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faac05] hover:bg-[#e09b00] text-white text-xs font-bold transition-all duration-200 w-fit shadow-sm"
                        >
                          <EyeIcon />
                          Details
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* ── MOBILE CARDS (below md) ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="block md:hidden"
          >
            {isLoading && (
              <div className="space-y-3">
                {Array(LIMIT).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-4 bg-gray-200 rounded" />
                      <div className="w-9 h-9 bg-gray-200 rounded-full" />
                      <div className="h-4 bg-gray-200 rounded w-28" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-8">
                      {Array(4).fill(null).map((__, j) => (
                        <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && <ErrorState />}
            {!isLoading && !isError && slots.length === 0 && <EmptyState filter={activeFilter} />}

            {!isLoading && !isError && slots.length > 0 && (
              <motion.div
                key={`mobile-${currentPage}-${activeFilter}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                  {slots.map((slot, index) => (
                    <SlotCard
                      key={slot._id}
                      slot={slot}
                      index={index}
                      page={currentPage}
                      onDetails={handleDetails}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* ── Pagination ───────────────────────────────────────────────── */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
              />
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default UpcomingSlotsPage;