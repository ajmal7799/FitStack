import { useState } from 'react';
import { Trash2, Plus, RefreshCw, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import { useGetSlots, useCreateSlot, useDeleteSlots, useCreateRecurringSlot } from '../../../hooks/Trainer/TrainerHooks';
import Pagination from '../../../components/pagination/Pagination';
import type { ISlotResponse } from '../../../types/slot';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

type FilterStatus = 'all' | 'upcoming' | 'booked' | 'past';

// ─── Helper: combine local date + time parts → UTC "Z" ISO string ────────────
// WHY: Zod .datetime() only accepts strings ending in Z (pure UTC).
// WHY NOT .toISOString() directly on selectedDate: react-datepicker's date-only
//   picker returns midnight UTC, so combining it naively with setHours() still
//   shifts the date in non-UTC timezones.
// FIX: construct a new Date() from explicit local year/month/day/hour/minute —
//   this respects the local timezone — then call .toISOString() which gives Z.
// e.g. IST user picks Jan 26, 09:00 AM
//   → new Date(2026, 0, 26, 9, 0) = Jan 26 09:00 IST
//   → .toISOString()              = "2026-01-25T03:30:00.000Z"  ✓ Zod accepts
//   → backend new Date(val)       = Jan 26 09:00 IST            ✓ correct time
const buildLocalISOString = (date: Date, time: Date): string => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0
  ).toISOString();
};

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
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    } catch {
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Booked', value: 'booked' },
    { label: 'Past', value: 'past' }
  ];

  // ─── FIXED: uses buildLocalISOString instead of .toISOString() ───────────
  const handleCreateSlot = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    const localISO = buildLocalISOString(selectedDate, selectedTime);
    try {
      await createSlotMutation.mutateAsync(localISO);
      setIsModalOpen(false);
      setSelectedDate(null);
      setSelectedTime(null);
      refetch();
      toast.success('Slot created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = (slotId: string) => {
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
    { label: 'Mon', value: 'MON' },
    { label: 'Tue', value: 'TUE' },
    { label: 'Wed', value: 'WED' },
    { label: 'Thu', value: 'THU' },
    { label: 'Fri', value: 'FRI' },
    { label: 'Sat', value: 'SAT' },
    { label: 'Sun', value: 'SUN' }
  ];

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleCreateRecurringSlot = async () => {
    if (!recurringStartDate || !recurringEndDate || !recurringStartTime || selectedWeekdays.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const formatTime = (date: Date) => {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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

  const addOneHour = (t: Date) => new Date(t.getTime() + 60 * 60 * 1000);

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Expired:   { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
    Booked:    { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
    Available: { bg: 'bg-orange-50',  text: 'text-orange-600', dot: 'bg-orange-400' }
  };

  return (
    <>
      {/* ── Global styles injected inline so no extra CSS file needed ── */}
      <style>{`
        :root {
          --orange: #f58d42;
          --orange-light: #fef3e8;
          --orange-dark: #d9722e;
          --white: #ffffff;
          --gray-50: #fafafa;
          --gray-100: #f5f5f5;
          --gray-200: #e8e8e8;
          --gray-500: #9e9e9e;
          --gray-700: #555;
          --gray-900: #1a1a1a;
        }

        /* DatePicker overrides to match our palette */
        .react-datepicker { font-family: inherit !important; border: 1.5px solid var(--gray-200) !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .react-datepicker__header { background: var(--orange) !important; border-bottom: none !important; padding: 12px !important; }
        .react-datepicker__current-month,
        .react-datepicker__day-name { color: #fff !important; font-weight: 600 !important; }
        .react-datepicker__navigation-icon::before { border-color: #fff !important; }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected { background: var(--orange) !important; border-radius: 8px !important; }
        .react-datepicker__day:hover { background: var(--orange-light) !important; border-radius: 8px !important; }
        .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected { background: var(--orange) !important; }
        .react-datepicker-wrapper { width: 100%; }
        .slot-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .slot-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,141,66,0.15); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full z-20">
          <TrainerSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64 overflow-hidden">
          <TrainerHeader />

          <main className="flex-1 overflow-y-auto" style={{ background: '#fafaf8' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

              {/* ── Page header ── */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Training Slots
                  </h1>
                  <p className="text-gray-500 mt-1 text-sm">
                    Manage your availability and schedule
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'var(--orange)' }}
                  >
                    <Plus size={16} />
                    Single Slot
                  </button>
                  <button
                    onClick={() => setIsRecurringModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm shadow-sm transition-all hover:bg-gray-800 active:scale-95"
                  >
                    <RefreshCw size={15} />
                    Recurring
                  </button>
                </div>
              </div>

              {/* ── Filter pills ── */}
              <div className="mb-6 flex gap-2 flex-wrap">
                {filterButtons.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setFilterStatus(f.value); setCurrentPage(1); }}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                    style={
                      filterStatus === f.value
                        ? { background: 'var(--orange)', color: '#fff', boxShadow: '0 2px 8px rgba(245,141,66,0.35)' }
                        : { background: '#fff', color: '#555', border: '1.5px solid #e8e8e8' }
                    }
                  >
                    {f.label}
                  </button>
                ))}

                {!isLoading && (
                  <span className="ml-auto self-center text-xs text-gray-400 font-medium">
                    {slots.length} / {totalSlots} slots
                  </span>
                )}
              </div>

              {/* ── States ── */}
              {isLoading && (
                <div className="flex justify-center items-center py-24">
                  <div className="w-10 h-10 rounded-full border-3 border-gray-200 border-t-orange-400 animate-spin"
                    style={{ borderTopColor: 'var(--orange)', borderWidth: 3 }} />
                </div>
              )}

              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                  <p className="text-red-600 font-medium">Failed to load slots. Please try again.</p>
                </div>
              )}

              {!isLoading && !isError && slots.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--orange-light)' }}>
                    <Calendar size={24} style={{ color: 'var(--orange)' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">No slots found</h3>
                  <p className="text-gray-400 text-sm">
                    No {filterStatus !== 'all' ? filterStatus : ''} slots at the moment.
                  </p>
                </div>
              )}

              {/* ── Slot grid ── */}
              {!isLoading && !isError && slots.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 fade-in">
                  {slots.map((slot) => {
                    const start = formatDateTime(slot.startTime);
                    const end = formatDateTime(slot.endTime);
                    const isExpired = new Date(slot.endTime) < new Date();
                    const label = isExpired ? 'Expired' : slot.isBooked ? 'Booked' : 'Available';
                    const cfg = statusConfig[label];

                    return (
                      <div
                        key={slot._id}
                        className="slot-card bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                      >
                        {/* Accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                          style={{
                            background: label === 'Available'
                              ? 'var(--orange)'
                              : label === 'Booked'
                                ? '#22c55e'
                                : '#d1d5db'
                          }} />

                        <div className="flex items-start justify-between mb-4 pt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {label}
                          </span>

                          {!slot.isBooked && (
                            <button
                              onClick={() => handleDeleteSlot(slot._id)}
                              disabled={deletingSlotId === slot._id}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                              title="Delete slot"
                            >
                              {deletingSlotId === slot._id
                                ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                                : <Trash2 size={15} />}
                            </button>
                          )}
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--orange-light)' }}>
                              <Calendar size={13} style={{ color: 'var(--orange)' }} />
                            </div>
                            <span className="font-semibold text-sm">{start.date}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--orange-light)' }}>
                              <Clock size={13} style={{ color: 'var(--orange)' }} />
                            </div>
                            <span className="font-semibold text-sm">{start.time} — {end.time}</span>
                          </div>
                        </div>

                        {slot.isBooked && slot.bookedBy && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                              Booked by <span className="font-semibold text-gray-700">{slot.bookedBy}</span>
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
      </div>

      {/* ══════════════════════════════════════════════════════
          SINGLE SLOT MODAL
      ══════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
              style={{ background: 'var(--orange-light)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--orange)' }}>
                  <Plus size={18} color="#fff" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Create Single Slot</h2>
              </div>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  placeholderText="Choose a date"
                  inline
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Time
                </label>
                <DatePicker
                  selected={selectedTime}
                  onChange={(time: Date | null) => setSelectedTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  placeholderText="Choose a time"
                  minTime={
                    selectedDate && selectedDate.toDateString() === new Date().toDateString()
                      ? new Date()
                      : new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  maxTime={new Date(new Date().setHours(23, 30, 0, 0))}
                />
              </div>

              {/* Preview */}
              {selectedDate && selectedTime && (
                <div className="rounded-xl p-4 border" style={{ background: 'var(--orange-light)', borderColor: '#f5c89a' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--orange-dark)' }}>
                    Slot Preview
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    {' '}<span style={{ color: 'var(--orange)' }}>→</span>{' '}
                    {addOneHour(selectedTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    <span className="ml-2 text-xs text-gray-400">(1 hour)</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreateSlot}
                  disabled={!selectedDate || !selectedTime || createSlotMutation.isPending}
                  className="flex-1 px-4 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--orange)' }}
                >
                  {createSlotMutation.isPending ? 'Creating…' : 'Create Slot'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════════════════ */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 fade-in">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Slot</h3>
                <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={cancelDelete}
                disabled={deletingSlotId === slotToDelete}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete}
                disabled={deletingSlotId === slotToDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {deletingSlotId === slotToDelete
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Deleting…</>
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          RECURRING SLOTS MODAL
      ══════════════════════════════════════════════════════ */}
      {isRecurringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-6 fade-in overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
              style={{ background: '#f0f4ff' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-900">
                  <RefreshCw size={16} color="#fff" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Create Recurring Slots</h2>
              </div>
              <button onClick={closeRecurringModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                  <DatePicker
                    selected={recurringStartDate}
                    onChange={(date: Date | null) => setRecurringStartDate(date)}
                    minDate={new Date()}
                    dateFormat="MMM d, yyyy"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    placeholderText="Select start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                  <DatePicker
                    selected={recurringEndDate}
                    onChange={(date: Date | null) => setRecurringEndDate(date)}
                    minDate={recurringStartDate || new Date()}
                    dateFormat="MMM d, yyyy"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    placeholderText="Select end date"
                  />
                </div>
              </div>

              {/* Start time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time * <span className="font-normal text-gray-400">(sessions are 1 hour)</span>
                </label>
                <DatePicker
                  selected={recurringStartTime}
                  onChange={(time: Date | null) => setRecurringStartTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  placeholderText="Choose start time"
                />
              </div>

              {/* Weekday selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Repeat on *
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekdaysList.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeekday(day.value)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150"
                      style={
                        selectedWeekdays.includes(day.value)
                          ? { background: '#1a1a1a', borderColor: '#1a1a1a', color: '#fff' }
                          : { background: '#fff', borderColor: '#e8e8e8', color: '#555' }
                      }
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {recurringStartDate && recurringEndDate && recurringStartTime && selectedWeekdays.length > 0 && (
                <div className="rounded-xl p-4 text-sm space-y-1.5"
                  style={{ background: '#f0f4ff', border: '1.5px solid #c7d4f7' }}>
                  <p className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">Summary</p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Period:</span>{' '}
                    {recurringStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
                    {recurringEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Time:</span>{' '}
                    {recurringStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} –{' '}
                    {addOneHour(recurringStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Days:</span>{' '}
                    {selectedWeekdays.map(d => weekdaysList.find(w => w.value === d)?.label).join(', ')}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={closeRecurringModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreateRecurringSlot}
                  disabled={
                    !recurringStartDate || !recurringEndDate || !recurringStartTime ||
                    selectedWeekdays.length === 0 || createRecurringSlotMutation.isPending
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {createRecurringSlotMutation.isPending ? 'Creating…' : 'Create Recurring Slots'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerSlotPage;