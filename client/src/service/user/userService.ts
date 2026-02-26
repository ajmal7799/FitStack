import AxiosInstance from '../../axios/axios';
import type{ UserBodyMetricsPayload } from '../../types/UserBodyMetricsPayload';

export const createUserProfile = async (formData: FormData) => {
  const response = await AxiosInstance.post('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getWorkoutPlan = async () => {
  const response = await AxiosInstance.get('/get-workout-plan');
  return response.data;
};

export const generateWorkoutPlan = async () => {
  const response = await AxiosInstance.post('/generate-workout-plan');
  return response.data;
};


export const getDietPlan = async () => {
  const response = await AxiosInstance.get('/get-diet-plan');
  return response.data;
};


export const generateDietPlan = async () => {
  const response = await AxiosInstance.post('/generate-diet-plan');
  return response.data;
};


export const getUserProfile = async () => {
  const response = await AxiosInstance.get('/profile');
  return response.data;
};


export const updateUserProfile = async (formData: FormData) => {
  const response = await AxiosInstance.patch('/profile-update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const getPersonalInfo = async () => {
  const response = await AxiosInstance.get('/personal-info');
  return response.data;
};


export const updatePersonalInfo = async (data: UserBodyMetricsPayload) => {
  const response = await AxiosInstance.patch('/personal-info-update', data);
  return response.data;
};


export const getTrainerDetails = async (id: string) => {
  try {
    const response = await AxiosInstance.get(`/get-trainer-details/${id}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

export const selectTrainer = async (trainerId: string) => {
  const response = await AxiosInstance.post('/select-trainer', { trainerId });
  return response.data;
};

export const getSelectedTrainer = async () => {
  const response = await AxiosInstance.get('/get-selected-trainer');
  return response.data;
};

export const getAvailableSlots = async (date: string) => {
  const response = await AxiosInstance.get('/get-available-slots/',{
    params: {
      date
    }
  });
  return response.data;
};

export const bookSlot = async (slotId: string) => {
  const response = await AxiosInstance.patch(`/book-slot/${slotId}`);
  return response.data;
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const response = await AxiosInstance.patch('/change-password', data);
  return response.data;
};


export const getBookedSlots = async (page = 1, limit = 10, status?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) {
    params.append('status', status);
  }
  const response = await AxiosInstance.get(`/booked-slots?${params.toString()}`);
  return response.data;
};


export const getBookedSlotDetails = async (slotId: string) => {
  const response = await AxiosInstance.get(`/booked-slots/${slotId}`);
  return response.data;
}


export const cancelBookedSlot = async (slotId: string, reason: string) => {
  const response = await AxiosInstance.patch(`/booked-slots/${slotId}/cancel`, { reason });
  return response.data;
};

export const joinSession = async (slotId: string) => {
  const response = await AxiosInstance.post(`/video-session/join/${slotId}`);
  return response.data;
};


export const getSessionHistory = async (page = 1, limit = 10, status?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) {
    params.append('status', status);
  }
  const response = await AxiosInstance.get(`/sessions-history?${params.toString()}`);
  return response.data;
}


export const getSessionHistoryDetails = async (sessionId: string) => {
  const response = await AxiosInstance.get(`/session-history/${sessionId}`);
  return response.data;
};


export const feedback = async (data: {sessionId: string; rating: number; review: string }) => {
  const response = await AxiosInstance.post('/feedback', data);
  return response.data;
};

export const getNotifications = async () => {
  const response = await AxiosInstance.get('/notifications');
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  await AxiosInstance.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async () => {
  await AxiosInstance.patch('/notifications/read-all');
};

export const clearAllNotifications = async () => {
  await AxiosInstance.delete('/notifications');
};

export const getWallet = async () => {
    const response = await AxiosInstance.get('/wallet');
    return response.data.data;
};
