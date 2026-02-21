import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetBookedSlots } from "../../../hooks/Trainer/TrainerHooks";
import TrainerHeader from "../../../components/trainer/Header";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import Pagination from "../../../components/pagination/Pagination";
import { useNavigate } from "react-router-dom";

// Interface for type safety
interface BookedSlot {
  _id: string;
  userName: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  booked: {
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    bg: "bg-red-50 border border-red-200",
    text: "text-red-500",
    dot: "bg-red-400",
  },
  default: {
    bg: "bg-gray-100 border border-gray-200",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};

const UpcomingSlotsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const limit = 4;

  const { data, isLoading, isError } = useGetBookedSlots(currentPage, limit);

  const handleClikkDetails = (slotId: string) => {
    if (!slotId) return;
    navigate(`/trainer/upcoming-slots/${slotId}`);
  };

  const slots: BookedSlot[] = data?.data?.result?.slots || [];
  const totalPages: number = data?.data?.result?.totalePages || 1;
  const totalSlots: number = data?.data?.result?.totalSlots || 0;

  const getStatus = (status: string) =>
    statusConfig[status] || statusConfig.default;

  return (
    <div className="flex min-h-screen bg-[#f8f8f6]">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col">
        <TrainerHeader />

        <main className="p-8">

          {/* Page Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Upcoming Slots
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage and view your scheduled appointments.
              </p>
            </div>
            <motion.div
              className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">
                {totalSlots} Appointments
              </span>
            </motion.div>
          </motion.div>

          {/* Table Container */}
          <motion.div
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-gray-900 text-white text-[11px] uppercase tracking-[0.18em] font-bold px-6 py-4">
              <div>Client</div>
              <div>Scheduled Time</div>
              <div>Duration</div>
              <div className="text-center">Status</div>
              <div className="text-center">Action</div>
            </div>

            {/* Table Body */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="py-20 flex justify-center items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 bg-gray-800 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  className="py-16 text-center text-red-400 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Failed to sync scheduled slots.
                </motion.div>
              ) : slots.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {slots.map((slot, index) => {
                    const status = getStatus(slot.slotStatus);
                    return (
                      <motion.div
                        key={slot._id}
                        className="grid grid-cols-5 items-center px-6 py-4 hover:bg-gray-50/70 transition-colors group"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.3, delay: index * 0.06 }}
                      >
                        {/* Client */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {slot.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {slot.userName}
                          </span>
                        </div>

                        {/* Scheduled Time */}
                        <div>
                          <div className="text-sm font-bold text-gray-800">
                            {new Date(slot.startTime).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(slot.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                            1 Hour Session
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${status.bg} ${status.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {slot.slotStatus}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="flex justify-center">
                          <motion.button
                            className="text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 uppercase tracking-tight"
                            onClick={() => handleClikkDetails(slot._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  key="empty"
                  className="py-20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-4xl mb-3">📅</div>
                  <p className="text-gray-400 font-medium text-sm">
                    No upcoming slots found in your schedule.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {!isLoading && slots.length > 0 && (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
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