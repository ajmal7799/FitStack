import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetBookedSlotDetails, useCancelBookedSlot } from "../../../hooks/User/userServiceHooks";
import { toast } from "react-hot-toast"; // Assuming you use toast for feedback

interface SlotDetails {
  _id: string;
  profileImage: string;
  trainerName: string;
  trainerEmail: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
}

const UserBookedSlotDetails = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, refetch } = useGetBookedSlotDetails(slotId || "");
  const { mutate: cancelSlot, isPending: isCancelling } = useCancelBookedSlot();

  const details: SlotDetails | undefined = data?.data?.result;

  const handleCancelSubmit = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    cancelSlot(
      { slotId: slotId || "", reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Booking cancelled successfully");
          setIsModalOpen(false);
          navigate(-1); // Go back to the bookings list
          refetch(); // Refresh data to show updated status
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to cancel booking");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <span className="mr-2">←</span> Back to Bookings
          </button>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md border border-blue-100 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Booking Overview</h2>
                <p className="text-blue-100 text-sm mt-1">Review your session details with the trainer</p>
              </div>
              <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                details?.slotStatus === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-white text-blue-600'
              }`}>
                {details?.slotStatus || "Processing..."}
              </span>
            </div>

            <div className="p-10">
              {isLoading ? (
                <div className="text-center py-20 text-blue-500 font-medium">Loading session details...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left: Trainer Profile */}
                  <div className="lg:col-span-4 flex flex-col items-center text-center space-y-5 border-r border-gray-50 pr-4">
                    <img 
                      src={details?.profileImage} 
                      alt="Trainer" 
                      className="w-40 h-40 rounded-2xl object-cover border-4 border-blue-50 shadow-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{details?.trainerName}</h3>
                      <p className="text-gray-500 font-medium">{details?.trainerEmail}</p>
                    </div>
                  </div>

                  {/* Right: Schedule Details */}
                  <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">
                          Scheduled Start
                        </label>
                        <p className="text-blue-900 font-bold text-lg">
                          {new Date(details?.startTime || "").toLocaleDateString([], { dateStyle: 'medium' })}
                        </p>
                        <p className="text-blue-600 font-medium">
                          {new Date(details?.startTime || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">
                          Scheduled End
                        </label>
                        <p className="text-blue-900 font-bold text-lg">
                          {new Date(details?.endTime || "").toLocaleDateString([], { dateStyle: 'medium' })}
                        </p>
                        <p className="text-blue-600 font-medium">
                          {new Date(details?.endTime || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]" onClick={()=> navigate("/chat")}> 
                       Chat with Trainer
                      </button>
                      
                      {details?.slotStatus !== 'cancelled' && (
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Cancellation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">Cancel Booking?</h3>
            <p className="text-gray-500 mb-6 text-sm">Please tell us why you need to cancel this session. This help us inform the trainer.</p>
            
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter reason for cancellation..."
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelSubmit}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-100 disabled:opacity-50 transition-all"
              >
                {isCancelling ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookedSlotDetails;