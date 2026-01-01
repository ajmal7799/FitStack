import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetAvailableSlots, useBookSlot } from "../../../hooks/User/userServiceHooks";
import { useNavigate } from 'react-router-dom';


interface Slot {
  _id: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy: string | null;
}

interface ToastProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
      type === "error"
        ? "bg-red-50 text-red-800 border border-red-200"
        : "bg-green-50 text-green-800 border border-green-200"
    }`}
  >
    {type === "error" ? (
      <XCircle className="w-5 h-5" />
    ) : (
      <CheckCircle className="w-5 h-5" />
    )}
    <span>{message}</span>
    <button
      onClick={onClose}
      className="ml-4 text-gray-500 hover:text-gray-700"
    >
      ×
    </button>
  </div>
);

interface ConfirmationModalProps {
  slot: Slot;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ slot, onConfirm, onCancel }) => {
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Booking</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to book this slot?
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-medium text-gray-800">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// interface InfoModalProps {
//   onClose: () => void;
// }

// const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//         <div className="flex items-start gap-3 mb-4">
//           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
//             <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">Important Notice</h3>
//             <p className="text-gray-600">
//               You can only book <strong>one slot per day</strong>. Please choose your preferred time slot carefully.
//             </p>
//           </div>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//           >
//             Got it
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const UserSlotBookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [slotToBook, setSlotToBook] = useState<Slot | null>(null);
//   const [showInfoModal, setShowInfoModal] = useState<boolean>(true);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const formattedDate = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
  const { data, isLoading, error, refetch } = useGetAvailableSlots(formattedDate);
  const { mutate: bookSlot, isPending: isBooking } = useBookSlot();

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (error) {
      const errorData = (error as any)?.response?.data;
      const errorMessage = errorData?.message || "Failed to fetch slots";
      
      if (errorMessage.toLowerCase().includes('trainer')) {
        showToast("Please select a trainer first!", "error");
        
        setTimeout(() => {
          navigate("/trainers");
        }, 2500);
      } else {
        showToast(errorMessage, "error");
      }
    }
  }, [error, navigate]);

  const handleBookClick = (slot: Slot) => {
    setSlotToBook(slot);
  };

  const handleConfirmBooking = () => {
    if (!slotToBook) return;

    bookSlot(slotToBook._id, {
      onSuccess: (response : any) => {
        const successMessage = response?.message || "Slot booked successfully!";
        showToast(successMessage, "success");
        setSlotToBook(null);
        refetch();
      },
      onError: (error: any) => {
        const errorData = error?.response?.data;
        const errorMessage = errorData?.message || "Failed to book slot";
        showToast(errorMessage, "error");
        setSlotToBook(null);
      }
    });
  };

  const handleCancelBooking = () => {
    setSlotToBook(null);
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    if (isPast(date)) {
      showToast("Cannot select dates in the past", "error");
      return;
    }
    setSelectedDate(date);
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  interface Data {
    data?: {
      result?: Slot[];
    };
  }

  const slots: Slot[] = (data as Data)?.data?.result || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Select Date
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <span className="text-xs font-semibold text-gray-700 w-24 text-center">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-md overflow-hidden">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-bold text-gray-400 bg-gray-50 py-1 uppercase"
                  >
                    {day.substring(0, 3)}
                  </div>
                ))}
                {days.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && handleDateClick(date)}
                    disabled={!date || isPast(date)}
                    className={`
          relative h-9 text-xs transition-all bg-white
          ${!date ? "bg-gray-50" : ""}
          ${
            isPast(date)
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-blue-50 text-gray-700"
          }
          ${
            isSelected(date)
              ? "bg-blue-600 text-white font-bold hover:bg-blue-700"
              : ""
          }
          ${isToday(date) && !isSelected(date) ? "text-blue-600 font-bold" : ""}
        `}
                  >
                    {date ? date.getDate() : ""}
                    {isToday(date) && !isSelected(date) && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Slots Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* Info Alert Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    <strong>Important:</strong> You can only book <strong>one slot per day</strong>. Please choose your preferred time slot carefully.
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5" />
                Available Slots for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-4">Loading slots...</p>
                </div>
              ) : !data ? null : slots.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No slots available for this date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`
                        border rounded-lg p-4 transition
                        ${
                          slot.isBooked
                            ? "bg-gray-50 border-gray-200 opacity-60"
                            : "border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              slot.isBooked ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </p>
                        </div>
                        {!slot.isBooked && (
                          <button 
                            onClick={() => handleBookClick(slot)}
                            disabled={isBooking}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isBooking ? "Booking..." : "Book"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {slotToBook && (
        <ConfirmationModal
          slot={slotToBook}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
        />
      )}

      {/* {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )} */}
    </div>
  );
};

export default UserSlotBookingPage;