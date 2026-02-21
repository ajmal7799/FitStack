import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import { useGetSlots, useCreateSlot, useDeleteSlots, useCreateRecurringSlot } from '../../../hooks/Trainer/TrainerHooks';
import Pagination from '../../../components/pagination/Pagination';
import type { ISlotResponse } from '../../../types/slot';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

type FilterStatus = 'all' | 'upcoming' | 'booked' | 'past';

const TrainerSlotPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurringStartDate, setRecurringStartDate] = useState<Date | null>(null);
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null);
  const [recurringStartTime, setRecurringStartTime] = useState<Date | null>(null);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const limit = 9;

  const { data, isLoading, isError, refetch } = useGetSlots(
    currentPage,
    limit,
    filterStatus === 'all' ? undefined : filterStatus
  );

  const createSlotMutation = useCreateSlot();
  const createRecurringSlotMutation = useCreateRecurringSlot();
  const deleteSlotMutation = useDeleteSlots({
    onSuccess: () => {
      toast.success('Slot deleted successfully!');
      setDeletingSlotId(null);
      refetch();
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const slots = (data as ISlotResponse)?.data?.result?.slots || [];
  const totalPages = (data as ISlotResponse)?.data?.result?.totalPages || 1;
  const totalSlots = (data as ISlotResponse)?.data?.result?.totalSlots || 0;

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch (error) {
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: 'All Slots', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Booked', value: 'booked' },
    { label: 'Past', value: 'past' }
  ];

  const handleCreateSlot = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(selectedTime.getHours());
    combinedDateTime.setMinutes(selectedTime.getMinutes());
    combinedDateTime.setSeconds(0);
    combinedDateTime.setMilliseconds(0);

    const isoString = combinedDateTime.toISOString();

    try {
      await createSlotMutation.mutateAsync(isoString);
      setIsModalOpen(false);
      setSelectedDate(null);
      setSelectedTime(null);
      refetch();
      toast.success('Slot created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    setSlotToDelete(slotId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
        
    setDeletingSlotId(slotToDelete);
    try {
      await deleteSlotMutation.mutateAsync(slotToDelete);
      setDeleteModalOpen(false);
      setSlotToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete slot');
      setDeletingSlotId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSlotToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const weekdaysList = [
    { label: 'Monday', value: 'MON' },
    { label: 'Tuesday', value: 'TUE' },
    { label: 'Wednesday', value: 'WED' },
    { label: 'Thursday', value: 'THU' },
    { label: 'Friday', value: 'FRI' },
    { label: 'Saturday', value: 'SAT' },
    { label: 'Sunday', value: 'SUN' }
  ];

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleCreateRecurringSlot = async () => {
    if (!recurringStartDate || !recurringEndDate || !recurringStartTime || selectedWeekdays.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (recurringStartDate < today) {
      toast.error('Start date cannot be in the past');
      return;
    }

    if (recurringEndDate < recurringStartDate) {
      toast.error('End date must be after start date');
      return;
    }

    const payload = {
      startDate: formatDate(recurringStartDate),
      endDate: formatDate(recurringEndDate),
      startTime: formatTime(recurringStartTime),
      weekdays: selectedWeekdays
    };

    try {
      await createRecurringSlotMutation.mutateAsync(payload as any);
      setIsRecurringModalOpen(false);
      setRecurringStartDate(null);
      setRecurringEndDate(null);
      setRecurringStartTime(null);
      setSelectedWeekdays([]);
      refetch();
      toast.success('Recurring slots created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create recurring slots');
    }
  };

  const closeRecurringModal = () => {
    setIsRecurringModalOpen(false);
    setRecurringStartDate(null);
    setRecurringEndDate(null);
    setRecurringStartTime(null);
    setSelectedWeekdays([]);
  };

  const calculateEndTime = (startTime: Date) => {
    return new Date(startTime.getTime() + 60 * 60 * 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="fixed left-0 top-0 h-full">
        <TrainerSidebar />
      </div>
            
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TrainerHeader />
                
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Training Slots
                </h1>
                <p className="text-gray-600">
                  Manage and view your training schedule
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Single Slot
                </button>
                <button
                  onClick={() => setIsRecurringModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Recurring Slots
                </button>
              </div>
            </div>

            <div className="mb-6 flex gap-3 flex-wrap">
              {filterButtons.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setFilterStatus(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    filterStatus === filter.value
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {!isLoading && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {slots.length} of {totalSlots} slots
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">
                  Failed to load slots. Please try again.
                </p>
              </div>
            )}

            {!isLoading && !isError && slots.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No slots found
                </h3>
                <p className="text-gray-600">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} slots available at the moment.
                </p>
              </div>
            )}

            {!isLoading && !isError && slots.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => {
                  const startDateTime = formatDateTime(slot.startTime);
                  const endDateTime = formatDateTime(slot.endTime);
                  const isExpired = new Date(slot.endTime) < new Date();

                  return (
                    <div
                      key={slot._id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isExpired
                              ? 'bg-gray-100 text-gray-700'
                              : slot.isBooked
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isExpired ? 'Expired' : slot.isBooked ? 'Booked' : 'Available'}
                        </span>
                       {!slot.isBooked && (
    <button
      onClick={() => handleDeleteSlot(slot._id)}
      disabled={deletingSlotId === slot._id}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete slot"
    >
      {deletingSlotId === slot._id ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  )}
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center text-gray-700 mb-1">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium">
                            {startDateTime.date}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center text-gray-700">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">
                            {startDateTime.time} - {endDateTime.time}
                          </span>
                        </div>
                      </div>

                      {slot.isBooked && slot.bookedBy && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Booked by: <span className="font-medium text-gray-900">{slot.bookedBy}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={handlePageChange}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Slot</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date : Date | null) => setSelectedDate(date)}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholderText="Choose a date"
                  inline
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <DatePicker
                  selected={selectedTime}
                  onChange={(time : Date| null) => setSelectedTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}  
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholderText="Choose a time"
                  minTime={
                    selectedDate && 
                    selectedDate.toDateString() === new Date().toDateString()
                      ? new Date()
                      : new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Selected Slot:
                  </p>
                  <p className="text-lg text-blue-900 font-semibold">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg text-blue-900 font-semibold">
                      {selectedTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                    <span className="text-blue-700">→</span>
                    <p className="text-lg text-blue-900 font-semibold">
                      {new Date(selectedTime.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Duration: 1 hour
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSlot}
                  disabled={!selectedDate || !selectedTime || createSlotMutation.isPending}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createSlotMutation.isPending ? 'Creating...' : 'Create Slot'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Slot</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete this slot? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelDelete}
                disabled={deletingSlotId === slotToDelete}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingSlotId === slotToDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingSlotId === slotToDelete ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Slot'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isRecurringModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Recurring Slots</h2>
              <button
                onClick={closeRecurringModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <DatePicker
                    selected={recurringStartDate}
                    onChange={(date: Date | null) => setRecurringStartDate(date)}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select start date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <DatePicker
                    selected={recurringEndDate}
                    onChange={(date: Date | null) => setRecurringEndDate(date)}
                    minDate={recurringStartDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select end date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time * (Session duration: 1 hour)
                </label>
                <DatePicker
                  selected={recurringStartTime}
                  onChange={(time: Date | null) => setRecurringStartTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholderText="Choose start time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Weekdays * (Choose at least one day)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {weekdaysList.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeekday(day.value)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedWeekdays.includes(day.value)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {recurringStartDate && recurringEndDate && recurringStartTime && selectedWeekdays.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-3">
                    Summary:
                  </p>
                  <div className="space-y-2 text-sm text-blue-900">
                    <p>
                      <span className="font-semibold">Period:</span> {recurringStartDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} - {recurringEndDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span> {recurringStartTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })} - {calculateEndTime(recurringStartTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })} (1 hour)
                    </p>
                    <p>
                      <span className="font-semibold">Days:</span> {selectedWeekdays.map(day => 
                        weekdaysList.find(w => w.value === day)?.label
                      ).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeRecurringModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRecurringSlot}
                  disabled={
                    !recurringStartDate || 
                    !recurringEndDate || 
                    !recurringStartTime || 
                    selectedWeekdays.length === 0 ||
                    createRecurringSlotMutation.isPending
                  }
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createRecurringSlotMutation.isPending ? 'Creating Slots...' : 'Create Recurring Slots'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerSlotPage;