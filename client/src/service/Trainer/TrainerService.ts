import AxiosInstance from '../../axios/axios';

export const submitTrainerVerification = async (formData: FormData) => {
  const response = await AxiosInstance.post('/trainer/verification', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfilePage = async () => {
  const response = await AxiosInstance.get('/trainer/profile');
  return (response.data as any).data.profileData;
};

export const updateProfilePage = async (formData: FormData) => {
  const response = await AxiosInstance.patch('/trainer/profile-update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getVerificationPage = async () => {
  const response = await AxiosInstance.get('/trainer/get-verification');
  return (response.data as any).data.verificationData;
};

export const createSlot = async (startTime: string) => {
  const response = await AxiosInstance.post('/trainer/slots', { startTime: startTime });
  return response.data;
};

export const getSlots = async (page: number, limit: number, status?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append('status',status);
  const response = await AxiosInstance.get(`/trainer/get-slots?${params.toString()}`);
  return response.data;
};


export const deleteSlots = async (slotId: string) => {
  const response = await AxiosInstance.delete(`/trainer/slots/${slotId}`);
  return response.data;
};

export const CreateRecurringSlot = async (data: string | string[]) => {
  const response = await AxiosInstance.post('/trainer/recurring-slots', data);
  return response.data;
};


export const getBookedSlots = async (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await AxiosInstance.get(`/trainer/booked-slots?${params.toString()}`);
  return response.data;
}

export const getBookedSlotDetails = async (slotId: string) => {
  const response = await AxiosInstance.get(`/trainer/booked-slots/${slotId}`);
  return response.data;
}