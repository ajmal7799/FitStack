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
}


export const getTrainerDetails = async (id: string) => {
  try {
    const response = await AxiosInstance.get(`/get-trainer-details/${id}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
}

export const selectTrainer = async (trainerId: string) => {
    const response = await AxiosInstance.post('/select-trainer', { trainerId });
    return response.data;
}

export const getSelectedTrainer = async () => {
    const response = await AxiosInstance.get('/get-selected-trainer');
    return response.data;
}

export const getAvailableSlots = async (date: string) => {
    const response = await AxiosInstance.get('/get-available-slots/',{
      params: {
        date
      }
    });
    return response.data;
}

export const bookSlot = async (slotId: string) => {
    const response = await AxiosInstance.patch(`/book-slot/${slotId}`);
    return response.data;
}