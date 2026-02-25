import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetBookedSlots } from "../../../hooks/User/userServiceHooks";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import Pagination from "../../../components/pagination/Pagination";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";
import { useNavigate } from "react-router-dom";

const SessionStatus = {
  COMPLETED: "completed",
  MISSED: "missed",
  CANCELLED: "cancelled",
  WAITING: "waiting",
} as const;

type SessionStatusValue = typeof SessionStatus[keyof typeof SessionStatus];

interface Slot {
  _id: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const STATUS_LABELS: Record<string, string> = {
  [SessionStatus.COMPLETED]: "Completed",
  [SessionStatus.MISSED]: "Missed",
  [SessionStatus.CANCELLED]: "Cancelled",
  [SessionStatus.WAITING]: "Waiting",
};

const STATUS_STYLES: Record<string, string> = {
  [SessionStatus.COMPLETED]: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  [SessionStatus.MISSED]: "bg-amber-100 text-amber-700 border border-amber-200",
  [SessionStatus.CANCELLED]: "bg-red-100 text-red-700 border border-red-200",
  [SessionStatus.WAITING]: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

const STATUS_DOT: Record<string, string> = {
  [SessionStatus.COMPLETED]: "bg-emerald-500",
  [SessionStatus.MISSED]: "bg-amber-500",
  [SessionStatus.CANCELLED]: "bg-red-500",
  [SessionStatus.WAITING]: "bg-yellow-500",
};

const filterButtons: { label: string; value: SessionStatusValue | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Waiting", value: SessionStatus.WAITING },
  { label: "Completed", value: SessionStatus.COMPLETED },
  { label: "Missed", value: SessionStatus.MISSED },
  { label: "Cancelled", value: SessionStatus.CANCELLED },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

const LIMIT = 4;

const UserBookedSlotsPage: React.FC = () => {
  // ✅ Same pattern as SessionHistoryPage — two separate states, reset in handler
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<SessionStatusValue | undefined>(undefined);

  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBookedSlots(
    currentPage,
    LIMIT,
    activeStatus
  );

  const bookedSlots: Slot[] = data?.data?.result?.slots || [];
  const totalPages: number = data?.data?.result?.totalePages || 1;
  const totalSlots: number = data?.data?.result?.totalSlots || 0;

  // ✅ Same as SessionHistoryPage — setPage(1) in the same synchronous handler
  const handleFilterChange = (status: SessionStatusValue | undefined) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleViewDetails = (slotId: string) => {
    if (!slotId) return;
    const path = FRONTEND_ROUTES.USER.SLOT_BOOKED_DETAILS.replace(":slotId", slotId);
    navigate(path);
  };



  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Page Header */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">My Booked Slots</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage and view all your booked sessions.</p>
            </div>
            <span className="text-xs md:text-sm text-gray-500 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
              Total: {totalSlots}
            </span>
          </motion.div>

          {/* Filter Pills */}
          <motion.div
            className="flex gap-2 mb-5 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {filterButtons.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleFilterChange(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                  ${activeStatus === value
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                  }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* ── DESKTOP TABLE (sm+) ──────────────────────────────────────── */}
          <motion.div
            className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_1.2fr_1.2fr_110px_90px] px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider gap-4">
              <span>#</span>
              <span>Trainer</span>
              <span>Start</span>
              <span>End</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Skeleton */}
            {isLoading && (
              <div className="divide-y divide-gray-50">
                {Array(LIMIT).fill(null).map((_, i) => (
                  <div key={i} className="grid grid-cols-[40px_1fr_1.2fr_1.2fr_110px_90px] px-6 py-4 animate-pulse gap-4 items-center">
                    {Array(6).fill(null).map((__, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
                </svg>
                <p className="text-sm">Something went wrong. Please try again.</p>
              </div>
            )}

            {!isLoading && !isError && bookedSlots.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm font-medium">No slots found{activeStatus ? ` for "${STATUS_LABELS[activeStatus]}"` : ""}</p>
                <p className="text-xs mt-1">Try a different filter or check back later.</p>
              </div>
            )}

            {/* Data rows */}
            {!isLoading && !isError && bookedSlots.length > 0 && (
              <motion.div
                key={`desktop-${currentPage}-${activeStatus}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-50"
              >
                <AnimatePresence mode="popLayout">
                  {bookedSlots.map((slot, index) => {
                    const statusKey = slot.slotStatus?.toLowerCase();
                    const badgeStyle = STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-600 border border-gray-200";
                    const dotStyle = STATUS_DOT[statusKey] ?? "bg-gray-400";
                    const badgeLabel = STATUS_LABELS[statusKey] ?? slot.slotStatus ?? "Booked";

                    return (
                      <motion.div
                        key={slot._id}
                        variants={rowVariants}
                        exit="exit"
                        className="grid grid-cols-[40px_1fr_1.2fr_1.2fr_110px_90px] px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 gap-4"
                      >
                        <span className="text-sm font-medium text-gray-400">
                          {((currentPage - 1) * LIMIT + index + 1).toString().padStart(2, "0")}
                        </span>

                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                            {slot.trainerName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 truncate capitalize">
                            {slot.trainerName}
                          </span>
                        </div>

                        <span className="text-sm text-gray-600 truncate">
                          {new Date(slot.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </span>

                        <span className="text-sm text-gray-600 truncate">
                          {new Date(slot.endTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${badgeStyle}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotStyle}`} />
                          {badgeLabel}
                        </span>

                        <button
                          onClick={() => handleViewDetails(slot._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 w-fit cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* ── MOBILE CARDS (below sm) ──────────────────────────────────── */}
          <motion.div
            className="block sm:hidden space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {isLoading ? (
              Array(LIMIT).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse space-y-3">
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
              ))
            ) : isError ? (
              <div className="py-14 text-center text-red-400 text-sm">Something went wrong.</div>
            ) : bookedSlots.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-gray-400 py-14">
                <span className="text-3xl">📭</span>
                <span className="text-sm">No slots found{activeStatus ? ` for "${STATUS_LABELS[activeStatus]}"` : ""}</span>
              </div>
            ) : (
              <motion.div
                key={`mobile-${currentPage}-${activeStatus}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {bookedSlots.map((slot, index) => {
                    const statusKey = slot.slotStatus?.toLowerCase();
                    const badgeStyle = STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-600 border border-gray-200";
                    const dotStyle = STATUS_DOT[statusKey] ?? "bg-gray-400";
                    const badgeLabel = STATUS_LABELS[statusKey] ?? slot.slotStatus ?? "Booked";

                    return (
                      <motion.div
                        key={slot._id}
                        variants={rowVariants}
                        exit="exit"
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 mb-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">
                              {((currentPage - 1) * LIMIT + index + 1).toString().padStart(2, "0")}
                            </span>
                            <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
                              {slot.trainerName.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 capitalize truncate">
                              {slot.trainerName}
                            </span>
                          </div>
                          <button
                            onClick={() => handleViewDetails(slot._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 flex-shrink-0"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-8">
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Start</p>
                            <p className="text-sm text-gray-700">
                              {new Date(slot.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">End</p>
                            <p className="text-sm text-gray-700">
                              {new Date(slot.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeStyle}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
                              {badgeLabel}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              className="mt-5 flex justify-center sm:justify-end"
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

export default UserBookedSlotsPage;