import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/Header";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useGetSessionAdminHistoryDetail } from "../../../hooks/Admin/AdminHooks";

// ── Types ─────────────────────────────────────────────────────────────────────
type SessionDetails = {
  _id: string;
  userName: string;
  userEmail: string;
  userNumber: string;
  userProfileImage: string;
  trainerName: string;
  trainerEmail: string;
  trainerNumber: string;
  trainerProfileImage: string;
  startTime: string;
  endTime: string;
  sessionStatus: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  rating?: number;
  review?: string;
  createdAt?: string;
};

// ── Theme token ───────────────────────────────────────────────────────────────
const AMBER = "#eb9b34";

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig: Record <
  string,
  { label: string; bg: string; text: string; dot: string; border: string; icon: React.ReactNode }
> = {
  completed: {
    label: "Completed",
    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  missed: {
    label: "Missed",
    bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  waiting: {
    label: "Waiting",
    bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  active: {
    label: "Active",
    bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", border: "border-violet-200",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
function getDuration(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
  return `${m} min`;
}

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 24 } },
};

const cancelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
  exit: { opacity: 0, scale: 0.97, y: -12, transition: { duration: 0.2 } },
};

// ── Star Display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
      <span className="ml-2 text-sm font-bold text-gray-700">
        {rating}<span className="text-gray-400 font-normal">/5</span>
      </span>
    </div>
  );
}

// ── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({
  image, name, email, phone, role,
}: {
  image: string;
  name: string;
  email: string;
  phone: string;
  role: "User" | "Trainer";
}) {
  const isTrainer = role === "Trainer";
  return (
    <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: AMBER }} />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: AMBER }}>
            {isTrainer ? (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v2m0 0h6a2 2 0 012 2v10a4 4 0 01-4 4H7z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            )}
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{role}</span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          {image ? (
            <img src={image} alt={name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" style={{ outline: `2px solid ${AMBER}` }} />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center text-xl font-bold uppercase flex-shrink-0 shadow-md" style={{ backgroundColor: AMBER }}>
              {name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 capitalize truncate">{name}</h3>
            <p className="text-xs text-gray-400 mt-0.5 break-all">{email}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Email</p>
              <p className="text-sm text-gray-800 break-all">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-gray-800">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonPage() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2.5 w-full">
            <div className="h-5 bg-gray-200 rounded w-48 mx-auto sm:mx-0" />
            <div className="h-4 bg-gray-100 rounded w-36 mx-auto sm:mx-0" />
            <div className="h-6 bg-gray-100 rounded-full w-24 mx-auto sm:mx-0" />
          </div>
          <div className="hidden sm:block w-28 h-16 bg-gray-100 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-44" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 bg-gray-100 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="space-y-1.5">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SessionAdminHistoryDetails = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate      = useNavigate();

  const { data, isLoading, isError } = useGetSessionAdminHistoryDetail(sessionId ?? "");

  const session: SessionDetails | undefined = data?.data?.result;
  const status      = session ? (statusConfig[session.sessionStatus] ?? statusConfig["missed"]) : null;
  const isCancelled = session?.sessionStatus === "cancelled";
  const isCompleted = session?.sessionStatus === "completed";
  const hasFeedback = isCompleted && !!session?.rating;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 group transition-colors"
            style={{ color: AMBER }}
          >
            <span className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-colors group-hover:bg-orange-50">
              <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Back to Sessions
          </motion.button>

          {isLoading && <SkeletonPage />}

          {isError && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700">Failed to load session details</p>
              <p className="text-sm text-gray-400 mt-1">Please try again or go back.</p>
            </motion.div>
          )}

          {!isLoading && !isError && session && status && (
            <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-5">

              {/* ── Hero Banner ───────────────────────────────────────── */}
              <motion.div variants={heroVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: AMBER }} />

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                    {/* Stacked avatars */}
                    <div className="relative flex-shrink-0 flex items-center">
                      <div className="relative z-10">
                        {session.userProfileImage ? (
                          <img src={session.userProfileImage} alt={session.userName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md" />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white flex items-center justify-center text-2xl font-bold uppercase border-4 border-white shadow-md" style={{ backgroundColor: AMBER }}>
                            {session.userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="-ml-4 relative">
                        {session.trainerProfileImage ? (
                          <img src={session.trainerProfileImage} alt={session.trainerName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md" />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold uppercase border-4 border-white shadow-md">
                            {session.trainerName.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Session meta */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Session Overview</p>
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
                        {session.userName}
                        <span className="text-gray-400 font-normal mx-2">×</span>
                        {session.trainerName}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(session.startTime)}</p>

                      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${status.bg} ${status.text} ${status.border}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          {session._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Duration — desktop */}
                    <div className="hidden sm:flex flex-col items-center rounded-2xl px-5 py-4 flex-shrink-0 border border-gray-200" style={{ backgroundColor: "#fff9f0" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: AMBER }}>Duration</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{getDuration(session.startTime, session.endTime)}</p>
                    </div>
                  </div>

                  {/* Duration — mobile */}
                  <div className="flex sm:hidden items-center justify-center gap-2 mt-4 rounded-xl py-3 px-4 border border-gray-200" style={{ backgroundColor: "#fff9f0" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: AMBER }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-800">Duration: {getDuration(session.startTime, session.endTime)}</p>
                  </div>
                </div>
              </motion.div>

              {/* ── Profile Cards ──────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ProfileCard image={session.userProfileImage} name={session.userName} email={session.userEmail} phone={session.userNumber} role="User" />
                <ProfileCard image={session.trainerProfileImage} name={session.trainerName} email={session.trainerEmail} phone={session.trainerNumber} role="Trainer" />
              </div>

              {/* ── Session Timing Card ────────────────────────────────── */}
              <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: AMBER }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Session Timing</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                  {[
                    { label: "Date",       value: formatDate(session.startTime) },
                    { label: "Start Time", value: formatTime(session.startTime) },
                    { label: "End Time",   value: formatTime(session.endTime) },
                    { label: "Duration",   value: getDuration(session.startTime, session.endTime) },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Cancellation Card ──────────────────────────────────── */}
              <AnimatePresence>
                {isCancelled && (
                  <motion.div
                    variants={cancelVariants}
                    initial="hidden" animate="show" exit="exit"
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="h-1 w-full bg-red-500" />
                    <div className="p-6">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Cancellation Details</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 mb-5">
                        {session.cancelledBy && (
                          <div className="py-4 sm:pr-6 first:pt-0 sm:first:pt-4">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Cancelled By</p>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                              <p className="text-sm font-bold text-gray-800 capitalize">{session.cancelledBy}</p>
                            </div>
                          </div>
                        )}
                        {session.cancelledAt && (
                          <div className="py-4 sm:px-6">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Cancelled At</p>
                            <p className="text-sm font-bold text-gray-800">{formatDateTime(session.cancelledAt)}</p>
                          </div>
                        )}
                        {session.cancellationReason && (
                          <div className="py-4 sm:pl-6">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Reason</p>
                            <p className="text-sm font-bold text-gray-800 break-words">{session.cancellationReason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3.5">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-red-600 leading-relaxed">
                          This session was cancelled
                          {session.cancelledBy === "user" ? " by the user" : session.cancelledBy === "trainer" ? " by the trainer" : ""}.
                          {" "}No further action is required unless a dispute has been raised.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Feedback Card — only for completed sessions ────────────── */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -16 }}
                    className="bg-white rounded-2xl border border-yellow-100 shadow-sm overflow-hidden"
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-yellow-300" />

                    <div className="p-6">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">User Feedback</h2>
                      </div>

                      {hasFeedback ? (
                        <div className="space-y-5">
                          {/* Rating */}
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating</p>
                            <StarDisplay rating={session.rating} />
                          </div>

                          {/* Review */}
                          {session.review && (
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Review</p>
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-700 leading-relaxed italic">"{session.review}"</p>
                              </div>
                            </div>
                          )}

                          {/* Submitted at */}
                          {session.createdAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Submitted on {formatDateTime(session.createdAt)}
                            </div>
                          )}
                        </div>
                      ) : (
                        // No feedback yet
                        <div className="flex flex-col items-center py-6 gap-3">
                          <div className="w-12 h-12 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-500">No feedback submitted</p>
                          <p className="text-xs text-gray-400 text-center">The user hasn't rated this session yet.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SessionAdminHistoryDetails;