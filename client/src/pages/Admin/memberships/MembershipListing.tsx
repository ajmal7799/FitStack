import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/Header";
import Pagination from "../../../components/pagination/Pagination";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetMembershipPage } from "../../../hooks/Admin/AdminHooks";

// ── Types ─────────────────────────────────────────────────────────────────────
type Membership = {
  _id: string;
  userName: string;
  planName: string;
  price: number;
  durationMonths: number;
  status: string;
  currentPeriodEnd: string;
  profileImage: string | null;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMIT = 6;

const STATUS_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All",        value: undefined },
  { label: "Active",     value: "active" },
  { label: "Trialing",   value: "trialing" },
  { label: "Past Due",   value: "past_due" },
  { label: "Canceled",   value: "canceled" },
  { label: "Incomplete", value: "incomplete" },
];

const statusStyles: Record<string, string> = {
  active:     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  trialing:   "bg-blue-100   text-blue-700   border border-blue-200",
  past_due:   "bg-amber-100  text-amber-700  border border-amber-200",
  canceled:   "bg-red-100    text-red-700    border border-red-200",
  incomplete: "bg-gray-100   text-gray-600   border border-gray-200",
};

const statusDot: Record<string, string> = {
  active:     "bg-emerald-500",
  trialing:   "bg-blue-500",
  past_due:   "bg-amber-500",
  canceled:   "bg-red-500",
  incomplete: "bg-gray-400",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(price);
}

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit:   { opacity: 0, x: -20, transition: { duration: 0.16 } },
};

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
      {name.charAt(0)}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${statusStyles[status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[status] ?? "bg-gray-400"}`} />
      {status.replace("_", " ")}
    </span>
  );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function MembershipCard({
  item, index, page,
}: {
  item: Membership;
  index: number;
  page: number;
}) {
  const rowNum = (page - 1) * LIMIT + index + 1;
  return (
    <motion.div
      variants={itemVariants}
      exit="exit"
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">{rowNum}</span>
          <Avatar name={item.userName} image={item.profileImage} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 capitalize truncate">{item.userName}</p>
            <p className="text-xs text-gray-400 truncate">{item.planName} · {item.durationMonths}mo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-8">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Plan</p>
          <p className="text-sm font-semibold text-gray-800">{item.planName}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Price</p>
          <p className="text-sm text-gray-700">{formatPrice(item.price)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Expires</p>
          <p className="text-sm text-gray-700">{formatDate(item.currentPeriodEnd)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
          <StatusBadge status={item.status} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty / Error states ──────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">No memberships found</p>
      <p className="text-xs mt-1">{hasSearch ? "Try a different search or filter." : "No memberships yet."}</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">Failed to load memberships</p>
      <p className="text-xs text-gray-400 mt-1">Please try again.</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const MembershipListing = () => {
//   const navigate = useNavigate();
  const [page, setPage]                 = useState(1);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");

  const { data, isLoading, isError } = useGetMembershipPage(page, LIMIT, activeFilter, search);

  const memberships: Membership[]    = data?.data?.result?.memberships      ?? [];
  const totalPages: number           = data?.data?.result?.totalPages        ?? 1;
  const totalMemberships: number     = data?.data?.result?.totalMemberships  ?? 0;

  const handleFilterChange = (value: string | undefined) => {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Memberships</h1>
              <p className="text-gray-500 text-sm mt-1">All user subscriptions across the platform.</p>
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
                  {totalMemberships} total membership{totalMemberships !== 1 ? "s" : ""}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Search */}
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
                placeholder="Search by user or plan name..."
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
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2"
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
            {STATUS_OPTIONS.map((opt) => (
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
                  Results for <span className="font-semibold text-gray-800">"{search}"</span>
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
            <div className="grid grid-cols-[40px_1.2fr_1fr_100px_120px_130px_110px] px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider gap-3">
              <span>#</span>
              <span>User</span>
              <span>Plan</span>
              <span>Price</span>
              <span>Duration</span>
              <span>Expires</span>
              <span>Status</span>
            </div>

            {isLoading && (
              <div className="divide-y divide-gray-50">
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} className="grid grid-cols-[40px_1.2fr_1fr_100px_120px_130px_110px] px-6 py-4 gap-3 animate-pulse items-center">
                    {Array(7).fill(null).map((__, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && <ErrorState />}
            {!isLoading && !isError && memberships.length === 0 && <EmptyState hasSearch={hasSearch} />}

            {!isLoading && !isError && memberships.length > 0 && (
              <motion.div
                key={`desktop-${page}-${activeFilter}-${search}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-50"
              >
                <AnimatePresence mode="wait">
                  {memberships.map((item: Membership, index: number) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      exit="exit"
                      className="grid grid-cols-[40px_1.2fr_1fr_100px_120px_130px_110px] px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 gap-3"
                    >
                      <span className="text-sm font-medium text-gray-400">
                        {(page - 1) * LIMIT + index + 1}
                      </span>

                      {/* User with avatar */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={item.userName} image={item.profileImage} />
                        <span className="text-sm font-medium text-gray-900 capitalize truncate">
                          {item.userName}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-gray-800 truncate">{item.planName}</span>
                      <span className="text-sm text-gray-700">{formatPrice(item.price)}</span>
                      <span className="text-sm text-gray-600">{item.durationMonths} month{item.durationMonths !== 1 ? "s" : ""}</span>
                      <span className="text-sm text-gray-600">{formatDate(item.currentPeriodEnd)}</span>
                      <StatusBadge status={item.status} />
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
            {!isLoading && !isError && memberships.length === 0 && <EmptyState hasSearch={hasSearch} />}

            {!isLoading && !isError && memberships.length > 0 && (
              <motion.div
                key={`mobile-${page}-${activeFilter}-${search}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <AnimatePresence mode="wait">
                  {memberships.map((item: Membership, index: number) => (
                    <MembershipCard
                      key={item._id}
                      item={item}
                      index={index}
                      page={page}
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

export default MembershipListing;