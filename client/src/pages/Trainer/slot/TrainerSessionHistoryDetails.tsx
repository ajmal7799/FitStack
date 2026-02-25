import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import TrainerHeader from "../../../components/trainer/Header";
import { useGetSessionHistoryDetails } from "../../../hooks/Trainer/TrainerHooks";
import { motion, type Variants } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type SessionDetails = {
  _id: string;
  userName: string;
  userEmail: string;
  profileImage: string;
  startTime: string;
  endTime: string;
  sessionStatus: string;
  rating?: number;
  review?: string;
  createdAt?: string;
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
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 24 } },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
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

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
  icon, title, iconBg = "bg-gray-900", children,
}: {
  icon: React.ReactNode;
  title: string;
  iconBg?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonPage() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-6 bg-gray-200 rounded w-40 mx-auto sm:mx-0" />
            <div className="h-4 bg-gray-100 rounded w-52 mx-auto sm:mx-0" />
            <div className="h-7 bg-gray-200 rounded-full w-24 mx-auto sm:mx-0" />
          </div>
          <div className="hidden sm:block w-24 h-16 bg-gray-100 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
            {Array(3).fill(null).map((_, j) => (
              <div key={j} className="flex gap-3 py-3 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-36" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TrainerSessionHistoryDetails = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSessionHistoryDetails(sessionId ?? "");

  const session: SessionDetails | undefined = data?.data?.result;
  const hasFeedback = !!session?.rating;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-6 group transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Back to Session History
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

          {!isLoading && !isError && session && (
            <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-5">

              {/* ── Hero Card ──────────────────────────────────────────────── */}
              <motion.div variants={heroVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Emerald top bar — always completed */}
                <div className="h-1.5 w-full bg-emerald-500" />

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {session.profileImage ? (
                        <img
                          src={session.profileImage}
                          alt={session.userName}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md border-4 border-white">
                          {session.userName.charAt(0)}
                        </div>
                      )}
                      {/* Always emerald dot — completed */}
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    {/* Client info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Client</p>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">{session.userName}</h1>
                      <p className="text-sm text-gray-500 mt-1 break-all">{session.userEmail}</p>

                      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        {/* Completed badge — always */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Completed
                        </span>
                        {/* Session ID */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          {session._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Duration pill — desktop */}
                    <div className="hidden sm:flex flex-col items-center bg-gray-900 text-white rounded-2xl px-5 py-4 flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Duration</p>
                      <p className="text-2xl font-bold mt-1">{getDuration(session.startTime, session.endTime)}</p>
                    </div>
                  </div>

                  {/* Duration — mobile */}
                  <div className="flex sm:hidden items-center justify-center gap-2 mt-4 bg-gray-900 text-white rounded-xl py-3 px-4">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold">Duration: {getDuration(session.startTime, session.endTime)}</p>
                  </div>
                </div>
              </motion.div>

              {/* ── Detail Cards Grid ──────────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Session Timing */}
                <SectionCard
                  iconBg="bg-gray-900"
                  icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  title="Session Timing"
                >
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    label="Date" value={formatDate(session.startTime)}
                  />
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Start Time" value={formatTime(session.startTime)}
                  />
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="End Time" value={formatTime(session.endTime)}
                  />
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    label="Duration" value={getDuration(session.startTime, session.endTime)}
                  />
                </SectionCard>

                {/* Client Info */}
                <SectionCard
                  iconBg="bg-gray-900"
                  icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  title="Client Info"
                >
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    label="Client Name" value={session.userName}
                  />
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    label="Client Email" value={session.userEmail}
                  />
                  <InfoRow
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Session Status" value="Completed"
                  />
                </SectionCard>
              </div>

              {/* ── Feedback Card — always shown ───────────────────────────── */}
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl border border-yellow-100 shadow-sm overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-yellow-300" />

                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Client Feedback</h2>
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
                    // No feedback from client yet
                    <div className="flex flex-col items-center py-6 gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-500">No feedback yet</p>
                      <p className="text-xs text-gray-400 text-center">The client hasn't submitted a rating for this session yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TrainerSessionHistoryDetails;