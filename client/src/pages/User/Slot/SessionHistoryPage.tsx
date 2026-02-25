import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import Pagination from "../../../components/pagination/Pagination";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetSessionHistory } from "../../../hooks/User/userServiceHooks";

const LIMIT = 10;

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  missed:    "bg-amber-100 text-amber-700 border border-amber-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const statusDot: Record<string, string> = {
  completed: "bg-emerald-500",
  missed:    "bg-amber-500",
  cancelled: "bg-red-500",
};

type Session = {
  _id: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  sessionStatus: string;
  rating?: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ── Star display (readonly) ───────────────────────────────────────────────────
function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) {
    return <span className="text-xs text-gray-300 italic">No rating</span>;
  }
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit:   { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

// ── Mobile Card ───────────────────────────────────────────────────────────────
function SessionCard({
  session, index, page, navigate,
}: {
  session: Session;
  index: number;
  page: number;
  navigate: (path: string) => void;
}) {
  const rowNum = (page - 1) * LIMIT + index + 1;

  return (
    <motion.div
      variants={itemVariants}
      exit="exit"
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">
            {rowNum}
          </span>
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
            {session.trainerName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-800 capitalize truncate">
            {session.trainerName}
          </span>
        </div>
        <button
          onClick={() => navigate(`/session-history/${session._id}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-8">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
          <p className="text-sm text-gray-700">{formatDate(session.startTime)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
          <p className="text-sm text-gray-700">
            {formatTime(session.startTime)} – {formatTime(session.endTime)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Rating</p>
          <StarDisplay rating={session.rating} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[session.sessionStatus] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[session.sessionStatus] ?? "bg-gray-400"}`} />
            {session.sessionStatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SessionHistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetSessionHistory(page, LIMIT, undefined);

  const sessions: Session[] = data?.data?.result?.sessions ?? [];
  const totalPages: number  = data?.data?.result?.totalPages ?? 1;

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm font-medium">No sessions found</p>
      <p className="text-xs mt-1">Your completed sessions will appear here.</p>
    </div>
  );

  const errorState = (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
      </svg>
      <p className="text-sm">Failed to load session history. Please try again.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F7F8FA] font-sans overflow-hidden">
      <UserSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10">

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Session History
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              All your completed training sessions.
            </p>
          </motion.div>

          {/* ── DESKTOP TABLE (md+) ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Header — replaced Dur. with Rating */}
            <div className="grid grid-cols-[40px_1fr_1.2fr_1fr_130px_100px_120px] px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider gap-4">
              <span>#</span>
              <span>Trainer</span>
              <span>Date</span>
              <span>Time</span>
              <span>Rating</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Skeleton */}
            {isLoading && (
              <div className="divide-y divide-gray-50">
                {Array(5).fill(null).map((_, i) => (
                  <div key={i} className="grid grid-cols-[40px_1fr_1.2fr_1fr_130px_100px_120px] px-6 py-4 animate-pulse gap-4 items-center">
                    {Array(7).fill(null).map((__, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && errorState}
            {!isLoading && !isError && sessions.length === 0 && emptyState}

            {/* Rows */}
            {!isLoading && !isError && sessions.length > 0 && (
              <motion.div
                key={`desktop-${page}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-50"
              >
                <AnimatePresence mode="wait">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session._id}
                      variants={itemVariants}
                      exit="exit"
                      className="grid grid-cols-[40px_1fr_1.2fr_1fr_130px_100px_120px] px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 gap-4"
                    >
                      <span className="text-sm font-medium text-gray-400">
                        {(page - 1) * LIMIT + index + 1}
                      </span>

                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                          {session.trainerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 capitalize truncate">
                          {session.trainerName}
                        </span>
                      </div>

                      <span className="text-sm text-gray-600 truncate">
                        {formatDate(session.startTime)}
                      </span>

                      <span className="text-sm text-gray-600 truncate">
                        {formatTime(session.startTime)} – {formatTime(session.endTime)}
                      </span>

                      {/* ✅ Rating column — replaces Duration */}
                      <StarDisplay rating={session.rating} />

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${statusStyles[session.sessionStatus] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[session.sessionStatus] ?? "bg-gray-400"}`} />
                        {session.sessionStatus}
                      </span>

                      <button
                        onClick={() => navigate(`/session-history/${session._id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 w-fit"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* ── MOBILE CARDS (below md) ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="block md:hidden"
          >
            {isLoading && (
              <div className="space-y-3">
                {Array(4).fill(null).map((_, i) => (
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
                ))}
              </div>
            )}

            {isError && !isLoading && errorState}
            {!isLoading && !isError && sessions.length === 0 && emptyState}

            {!isLoading && !isError && sessions.length > 0 && (
              <motion.div
                key={`mobile-${page}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <AnimatePresence mode="wait">
                  {sessions.map((session, index) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      index={index}
                      page={page}
                      navigate={navigate}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination currentPage={page} totalPages={totalPages} setPage={setPage} />
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SessionHistoryPage;