// components/notification/NotificationBell.tsx
import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetNotifications, useMarkAsRead, useMarkAllAsRead, useClearAllNotifications } from '../../hooks/User/userServiceHooks';
import { setNotifications, markOneRead, markAllRead, clearNotifications } from '../../redux/slice/notificationSlice';
import type { Rootstate } from '../../redux/store';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sweeping, setSweeping] = useState(false);

  const { notifications, unreadCount } = useSelector((state: Rootstate) => state.notifications);

  const { data } = useGetNotifications();

  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const clearMutation = useClearAllNotifications();

  useEffect(() => {
    if (data)
      dispatch(
        setNotifications({
          notifications: data.data.notifications,
          unreadCount: data.data.unreadCount,
        })
      );
  }, [data, dispatch]);

  // Close dropdown on outside click (desktop only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMarkOne = (notificationId: string) => {
    dispatch(markOneRead(notificationId));
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAll = () => {
    setSweeping(true);
    dispatch(markAllRead());
    markAllMutation.mutate();
    setTimeout(() => setSweeping(false), 800);
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
    clearMutation.mutate();
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      SLOT_BOOKED: '📅',
      SESSION_CANCELLED: '❌',
      VERIFICATION_APPROVED: '✅',
      VERIFICATION_REJECTED: '🚫',
      PAYMENT_FAILED: '💳',
      PAYMENT_SUCCESS: '💰',
      FEEDBACK_RECEIVED: '⭐',
      SUBSCRIPTION_PURCHASED: '🎉',
      SUBSCRIPTION_CANCELLED: '⚠️',
      SUBSCRIPTION_EXPIRED: '⏰',
    };
    return icons[type] || '🔔';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const Panel = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-gray-900 text-base">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full leading-none">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Blue rounded square "Mark all read" icon button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={sweeping}
              title="Mark all as read"
              className={`
                w-8 h-8 flex items-center justify-center rounded-xl
                bg-blue-500 hover:bg-blue-600
                active:scale-90
                shadow-sm
                transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                ${sweeping ? 'scale-90 opacity-70' : ''}
              `}
            >
              <Check className={`w-4 h-4 text-white stroke-[2.5] ${sweeping ? 'animate-ping' : ''}`} />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              // title="Clear all"
              // className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all duration-150"
            >
              {/* <Trash2 className="w-3.5 h-3.5" /> */}
              {/* <span className="hidden sm:inline">Clear</span> */}
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-0.5"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 px-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-sm font-medium text-gray-500">You're all caught up</p>
            <p className="text-xs mt-1 text-center text-gray-400">We'll notify you when something happens</p>
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`
                  flex items-start gap-3 px-4 py-3.5 border-b border-gray-50
                  hover:bg-gray-50/80 transition-colors
                  ${!notification.isRead ? 'bg-indigo-50/40' : ''}
                `}
              >
                {/* Unread dot */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-1">
                  <span className="text-xl leading-none">{getNotificationIcon(notification.type)}</span>
                  {!notification.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 block" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-gray-900 leading-snug ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkOne(notification._id)}
                    title="Mark as read"
                    className="flex-shrink-0 p-1.5 hover:bg-indigo-100 rounded-full transition-colors mt-0.5"
                  >
                    <Check className="w-3.5 h-3.5 text-indigo-500" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Trigger button ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open notifications"
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* ── DESKTOP dropdown ── */}
        {isOpen && (
          <div className="hidden sm:block absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[520px]">
            <Panel />
          </div>
        )}
      </div>

      {/* ── MOBILE full-screen bottom sheet ── */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div
            className="relative bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '85dvh', minHeight: '50dvh' }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <Panel />
          </div>
        </div>
      )}
    </>
  );
}