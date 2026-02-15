import React, { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
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
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-900">My Booked Slots</h1>
            <div className="bg-blue-600 text-white px-4 py-1 rounded-lg shadow-sm font-medium">
              Total: {totalSlots}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-16 text-center">SI</th>
                  <th className="p-4">Trainer</th>
                  <th className="p-4">Start Date & Time</th>
                  <th className="p-4">End Date & Time</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-blue-500 font-medium">
                      Loading appointments...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-red-500 font-medium">
                      Error fetching data.
                    </td>
                  </tr>
                ) : bookedSlots.length > 0 ? (
                  bookedSlots.map((slot, index) => (
                    <tr key={slot._id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 text-center font-medium text-gray-400">
                        {((currentPage - 1) * limit + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="p-4 font-semibold text-blue-900">
                        {slot.trainerName}
                      </td>
                      <td className="p-4">
                        {new Date(slot.startTime).toLocaleString([], { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td className="p-4">
                        {new Date(slot.endTime).toLocaleString([], { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold uppercase border border-blue-200">
                          {slot.slotStatus || 'Booked'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleViewDetails(slot._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400 font-medium">
                      No slots found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
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