import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const submitTrainerVerification = async (formData: FormData) => {
  const response = await AxiosInstance.post(API_ROUTES.TRAINER.VERIFICATION, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfilePage = async () => {
  const response = await AxiosInstance.get(API_ROUTES.TRAINER.GET_PROFILE);
  return (response.data as any).data.profileData;
};

export const updateProfilePage = async (formData: FormData) => {
  const response = await AxiosInstance.patch(API_ROUTES.TRAINER.UPDATE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getVerificationPage = async () => {
  const response = await AxiosInstance.get(API_ROUTES.TRAINER.GET_VERIFICATION_PAGE);
  return (response.data as any).data.verificationData;
};

export const createSlot = async (startTime: string) => {
  const response = await AxiosInstance.post(API_ROUTES.TRAINER.CREATE_SLOT, { startTime: startTime });
  return response.data;
};

export const getSlots = async (page: number, limit: number, status?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append('status',status);
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_SLOTS}?${params.toString()}`);
  return response.data;
};


export const deleteSlots = async (slotId: string) => {
  const response = await AxiosInstance.delete(`${API_ROUTES.TRAINER.DELETE_SLOT}/${slotId}`);
  return response.data;
};

export const CreateRecurringSlot = async (data: string | string[]) => {
  const response = await AxiosInstance.post(API_ROUTES.TRAINER.CREATE_RECURRING_SLOT, data);
  return response.data;
};


export const getBookedSlots = async (page: number, limit: number, status?: string, search?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append('status',status);
  if(search) params.append('search',search);
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_BOOKED_SLOTS}?${params.toString()}`);
  return response.data;
};

export const getBookedSlotDetails = async (slotId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_BOOKED_SLOT_DETAILS}/${slotId}`);
  return response.data;
};

export const getSessionHistory = async (page: number, limit: number, status?: string, search?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),  });
  if(status) params.append('status',status);
  if(search) params.append('search',search);
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_SESSION_HISTORY}?${params.toString()}`);
  return response.data;
};


export const getSessionHistoryDetails = async (sessionId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.TRAINER.GET_SESSION_HISTORY_DETAILS}/${sessionId}`);
  return response.data;
};