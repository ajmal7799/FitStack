// redux/slices/notificationSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  _id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<{ notifications: Notification[]; unreadCount: number }>) {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markOneRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find(n => n._id === action.payload);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach(n => n.isRead = true);
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markOneRead, markAllRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;