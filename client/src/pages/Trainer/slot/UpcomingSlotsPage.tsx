import React, { useState } from "react";
import { useGetBookedSlots } from "../../../hooks/Trainer/TrainerHooks";
import TrainerHeader from "../../../components/trainer/Header";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import Pagination from "../../../components/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";

// Interface for type safety
interface BookedSlot {
  _id: string;
  userName: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const UpcomingSlotsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
  const limit = 2;

  const { data, isLoading, isError } = useGetBookedSlots(currentPage, limit);
  

  const handleClikkDetails = (slotId: string) => {
    if (!slotId) return;
    // Implement the logic to navigate to the slot details page or open a modal
    // const path = 
    navigate(`/trainer/upcoming-slots/${slotId}`);
  }

  const slots: BookedSlot[] = data?.data?.result?.slots || [];
  const totalPages: number = data?.data?.result?.totalePages || 1;
  const totalSlots: number = data?.data?.result?.totalSlots || 0;

  return (
    <div className="flex min-h-screen bg-white">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col">
        <TrainerHeader />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
                Upcoming Slots
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage and view your scheduled appointments.</p>
            </div>
            <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
              Total Appointments: {totalSlots}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white text-[11px] uppercase tracking-[0.2em]">
                  <th className="p-5 font-bold">Client Name</th>
                  <th className="p-5 font-bold">Scheduled Time</th>
                  <th className="p-5 font-bold">Duration</th>
                  <th className="p-5 font-bold text-center">Status</th>
                  <th className="p-5 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-.5s]"></div>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-red-500 font-medium">
                      Failed to sync scheduled slots.
                    </td>
                  </tr>
                ) : slots.length > 0 ? (
                  slots.map((slot) => (
                    <tr key={slot._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-black border border-gray-200">
                            {slot.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-black">{slot.userName}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-black">
                          {new Date(slot.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          1 Hour Session
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          slot.slotStatus === 'booked' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100 line-through'
                        }`}>
                          {slot.slotStatus}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          className="text-xs font-bold text-black border-b-2 border-black hover:text-gray-500 hover:border-gray-500 transition-all uppercase tracking-tighter"
                          onClick={() => handleClikkDetails(slot._id)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400">
                      No upcoming slots found in your schedule.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="mt-8 flex justify-center">
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

export default UpcomingSlotsPage;