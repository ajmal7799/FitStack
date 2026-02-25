import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/Header";
import Pagination from "../../../components/pagination/Pagination";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetSessionAdminHistory } from "../../../hooks/Admin/AdminHooks";

// ── Constants ─────────────────────────────────────────────────────────────────
const SessionStatus = {
  COMPLETED: "completed",
  MISSED:    "missed",
  CANCELLED: "cancelled",
  WAITING:   "waiting",
  ACTIVE:    "active",
} as const;

type SessionStatusValue = (typeof SessionStatus)[keyof typeof SessionStatus];

const LIMIT = 3;

// ── Status styles ─────────────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  missed:    "bg-amber-100  text-amber-700  border border-amber-200",
  cancelled: "bg-red-100    text-red-700    border border-red-200",
  waiting:   "bg-blue-100   text-blue-700   border border-blue-200",
  active:    "bg-violet-100 text-violet-700 border border-violet-200",
};

const statusDot: Record<string, string> = {
  completed: "bg-emerald-500",
  missed:    "bg-amber-500",
  cancelled: "bg-red-500",
  waiting:   "bg-blue-500",
  active:    "bg-violet-500",
};

// ── Filter options ────────────────────────────────────────────────────────────
const filterOptions: { label: string; value: SessionStatusValue | undefined }[] = [
  { label: "All",       value: undefined },
  { label: "Completed", value: SessionStatus.COMPLETED },
  { label: "Missed",    value: SessionStatus.MISSED },
  { label: "Cancelled", value: SessionStatus.CANCELLED },
  { label: "Waiting",   value: SessionStatus.WAITING },
  { label: "Active",    value: SessionStatus.ACTIVE },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Session = {
  _id: string;
  userName: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  sessionStatus: string;
  rating?: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit:   { opacity: 0, x: -20, transition: { duration: 0.16 } },
};

// ── Star Display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) return <span className="text-xs text-gray-300 italic">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-xs";
  return (
    <div className={`${dim} rounded-full bg-gray-800 text-white flex items-center justify-center font-bold uppercase flex-shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${statusStyles[status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
}

// ── Eye Icon ──────────────────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

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
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">{rowNum}</span>
          <Avatar name={session.userName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 capitalize truncate">{session.userName}</p>
            <p className="text-xs text-gray-400 capitalize truncate">via {session.trainerName}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/sessions/${session._id}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all duration-200 flex-shrink-0"
        >
          <EyeIcon /> View
        </button>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-8">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
          <p className="text-sm text-gray-700">{formatDate(session.startTime)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
          <p className="text-sm text-gray-700">{formatTime(session.startTime)} – {formatTime(session.endTime)}</p>
        </div>
        {/* ✅ Rating replaces Duration */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Rating</p>
          <StarDisplay rating={session.rating} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
          <StatusBadge status={session.sessionStatus} />
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Trainer</p>
          <div className="flex items-center gap-1.5">
            <Avatar name={session.trainerName} size="sm" />
            <p className="text-sm text-gray-700 capitalize">{session.trainerName}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty / Error states ──────────────────────────────────────────────────────
const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-600">No sessions found</p>
    <p className="text-xs mt-1">{hasSearch ? "Try a different search term or filter." : "Try a different filter or check back later."}</p>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-600">Failed to load sessions</p>
    <p className="text-xs text-gray-400 mt-1">Please try again.</p>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const SessionAdminHistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage]                 = useState(1);
  const [activeFilter, setActiveFilter] = useState<SessionStatusValue | undefined>(undefined);
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");

  const { data, isLoading, isError } = useGetSessionAdminHistory(page, LIMIT, activeFilter, search);

  const sessions: Session[]   = data?.data?.result?.sessions      ?? [];
  const totalPages: number    = data?.data?.result?.totalPages     ?? 1;
  const totalSessions: number = data?.data?.result?.totalSessions  ?? 0;

  const handleFilterChange = (value: SessionStatusValue | undefined) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">All Sessions</h1>
              <p className="text-gray-500 text-sm mt-1">Monitor and manage all platform sessions.</p>
            </div>
            {!isLoading && !isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm self-start sm:self-auto"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {totalSessions} total session{totalSessions !== 1 ? "s" : ""}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-5"
          >
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by user or trainer..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition placeholder-gray-400"
              />
              {searchInput && (
                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex gap-2 mb-5 flex-wrap"
          >
            {filterOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleFilterChange(opt.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                  ${activeFilter === opt.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>

          {/* Active search indicator */}
          <AnimatePresence>
            {hasSearch && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="text-xs text-gray-500">
                  Showing results for <span className="font-semibold text-gray-800">"{search}"</span>
                </span>
                <button onClick={handleClearSearch} className="text-xs text-indigo-700 underline hover:text-indigo-900 font-medium">
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DESKTOP TABLE (md+) ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* ✅ Dur. → Rating, updated grid */}
            <div className="grid grid-cols-[40px_1fr_1fr_1.2fr_1fr_120px_110px_110px] px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider gap-3">
              <span>#</span>
              <span>User</span>
              <span>Trainer</span>
              <span>Date</span>
              <span>Time</span>
              <span>Rating</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {isLoading && (
              <div className="divide-y divide-gray-50">
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} className="grid grid-cols-[40px_1fr_1fr_1.2fr_1fr_120px_110px_110px] px-6 py-4 gap-3 animate-pulse items-center">
                    {Array(8).fill(null).map((__, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && <ErrorState />}
            {!isLoading && !isError && sessions.length === 0 && <EmptyState hasSearch={hasSearch} />}

            {!isLoading && !isError && sessions.length > 0 && (
              <motion.div
                key={`desktop-${page}-${activeFilter}-${search}`}
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
                      className="grid grid-cols-[40px_1fr_1fr_1.2fr_1fr_120px_110px_110px] px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 gap-3"
                    >
                      <span className="text-sm font-medium text-gray-400">
                        {(page - 1) * LIMIT + index + 1}
                      </span>

                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={session.userName} />
                        <span className="text-sm font-medium text-gray-900 capitalize truncate">{session.userName}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={session.trainerName} />
                        <span className="text-sm text-gray-600 capitalize truncate">{session.trainerName}</span>
                      </div>

                      <span className="text-sm text-gray-600 truncate">{formatDate(session.startTime)}</span>

                      <span className="text-sm text-gray-600 truncate">
                        {formatTime(session.startTime)} – {formatTime(session.endTime)}
                      </span>

                      {/* ✅ Rating replaces Duration */}
                      <StarDisplay rating={session.rating} />

                      <StatusBadge status={session.sessionStatus} />

                      <button
                        onClick={() => navigate(`/admin/sessions/${session._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all duration-200 w-fit"
                      >
                        <EyeIcon /> View
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* ── MOBILE CARDS (below md) ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="block md:hidden"
          >
            {isLoading && (
              <div className="space-y-3">
                {Array(4).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-4 bg-gray-200 rounded" />
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div className="h-4 bg-gray-200 rounded w-28" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-10">
                      {Array(5).fill(null).map((__, j) => (
                        <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && <ErrorState />}
            {!isLoading && !isError && sessions.length === 0 && <EmptyState hasSearch={hasSearch} />}

            {!isLoading && !isError && sessions.length > 0 && (
              <motion.div
                key={`mobile-${page}-${activeFilter}-${search}`}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Pagination currentPage={page} totalPages={totalPages} setPage={setPage} />
          </motion.div>

        </main>
      </div>
    </div>
  );
};

export default SessionAdminHistoryPage;