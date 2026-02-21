import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetBookedSlots } from "../../../hooks/User/userServiceHooks";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import Pagination from "../../../components/pagination/Pagination";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";
import { useNavigate } from "react-router-dom";

// Defined interfaces to avoid 'any' types and TS errors
interface Slot {
  _id: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const UserBookedSlotsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBookedSlots(currentPage, limit);

  // Note: 'totalePages' matches your Postman response spelling
  const bookedSlots: Slot[] = data?.data?.result?.slots || [];
  const totalPages: number = data?.data?.result?.totalePages || 1;
  const totalSlots: number = data?.data?.result?.totalSlots || 0;

  const handleViewDetails = (slotId: string) => {
    if (!slotId) return;
    // Replace the placeholder with the actual ID
    const path = FRONTEND_ROUTES.USER.SLOT_BOOKED_DETAILS.replace(':slotId', slotId);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">

          {/* Header Section */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-800">My Booked Slots</h1>
            <span className="text-sm text-gray-500">Total: {totalSlots}</span>
          </motion.div>

          {/* Table Container */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SI</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trainer</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date & Time</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date & Time</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.tr
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="py-10 text-center text-gray-400">Loading appointments...</td>
                      </motion.tr>
                    ) : isError ? (
                      <motion.tr
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="py-10 text-center text-red-400">Error fetching data.</td>
                      </motion.tr>
                    ) : bookedSlots.length > 0 ? (
                      bookedSlots.map((slot, index) => (
                        <motion.tr
                          key={slot._id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.3, delay: index * 0.06 }}
                          className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors duration-150"
                        >
                          <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                            {((currentPage - 1) * limit + index + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="px-5 py-4 font-medium text-gray-800">{slot.trainerName}</td>
                          <td className="px-5 py-4 text-gray-600">
                            {new Date(slot.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {new Date(slot.endTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                          <td className="px-5 py-4">{slot.slotStatus || 'Booked'}</td>
                          <td className="px-5 py-4">
                            <motion.button
                              onClick={() => handleViewDetails(slot._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="py-10 text-center text-gray-400">No slots found</td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          <div className="mt-5 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setCurrentPage}
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default UserBookedSlotsPage;