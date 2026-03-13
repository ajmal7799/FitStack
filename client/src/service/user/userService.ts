import AxiosInstance from '../../axios/axios';
import type{ UserBodyMetricsPayload } from '../../types/UserBodyMetricsPayload';
import { API_ROUTES } from '../../constants/apiRoutes';


export const createUserProfile = async (formData: FormData) => {
  const response = await AxiosInstance.post(API_ROUTES.USER.PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getWorkoutPlan = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_WORKOUT_PLAN);
  return response.data;
};

export const generateWorkoutPlan = async () => {
  const response = await AxiosInstance.post(API_ROUTES.USER.GENERATE_WORKOUT_PLAN);
  return response.data;
};


export const getDietPlan = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_DIET_PLAN);
  return response.data;
};


export const generateDietPlan = async () => {
  const response = await AxiosInstance.post(API_ROUTES.USER.GENERATE_DIET_PLAN);
  return response.data;
};


export const getUserProfile = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_PROFILE);
  return response.data;
};


export const updateUserProfile = async (formData: FormData) => {
  const response = await AxiosInstance.patch(API_ROUTES.USER.UPDATE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const getPersonalInfo = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_PROFILE_PERSONAL_INFO);
  return response.data;
};


export const updatePersonalInfo = async (data: UserBodyMetricsPayload) => {
  const response = await AxiosInstance.patch(API_ROUTES.USER.UPDATE_PROFILE_PERSONAL_INFO, data);
  return response.data;
};


export const getTrainerDetails = async (id: string) => {
  try {
    const response = await AxiosInstance.get(`${API_ROUTES.USER.GET_TRAINER_DETAILS}/${id}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

export const selectTrainer = async (trainerId: string) => {
  const response = await AxiosInstance.post(API_ROUTES.USER.SELECT_TRAINER, { trainerId });
  return response.data;
};

export const getSelectedTrainer = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_SELECTED_TRAINER);
  return response.data;
};

export const getAvailableSlots = async (date: string) => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_AVAILABLE_SLOTS,{
    params: {
      date
    }
  });
  return response.data;
};

export const bookSlot = async (slotId: string) => {
  const response = await AxiosInstance.patch(`${API_ROUTES.USER.BOOK_SLOT}/${slotId}`);
  return response.data;
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const response = await AxiosInstance.patch(API_ROUTES.USER.CHANGE_PASSWORD, data);
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
  const response = await AxiosInstance.get(`${API_ROUTES.USER.GET_BOOKED_SLOTS}?${params.toString()}`);
  return response.data;
};


export const getBookedSlotDetails = async (slotId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.USER.GET_BOOKED_SLOT_DETAILS}/${slotId}`);
  return response.data;
};


export const cancelBookedSlot = async (slotId: string, reason: string) => {
  const response = await AxiosInstance.patch(`${API_ROUTES.USER.CANCEL_BOOKED_SLOT}/${slotId}/cancel`, { reason });
  return response.data;
};

export const joinSession = async (slotId: string) => {
  const response = await AxiosInstance.post(`${API_ROUTES.USER.VIDEO_SESSION}/${slotId}`);
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
  const response = await AxiosInstance.get(`${API_ROUTES.USER.SESSION_HISTORY}?${params.toString()}`);
  return response.data;
};


export const getSessionHistoryDetails = async (sessionId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.USER.SESSION_HISTORY_DETAILS}/${sessionId}`);
  return response.data;
};


export const feedback = async (data: {sessionId: string; rating: number; review: string }) => {
  const response = await AxiosInstance.post(API_ROUTES.USER.FEEDBACK, data);
  return response.data;
};

export const getNotifications = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_NOTIFICATIONS);
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  await AxiosInstance.patch(`${API_ROUTES.USER.MARK_AS_READ}/${notificationId}/read`);
};

export const markAllAsRead = async () => {
  await AxiosInstance.patch(API_ROUTES.USER.MARK_ALL_AS_READ);
};

export const clearAllNotifications = async () => {
  await AxiosInstance.delete(API_ROUTES.USER.CLEAR_ALL_NOTIFICATIONS);
};

export const getWallet = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_WALLET);
  return response.data.data;
};
