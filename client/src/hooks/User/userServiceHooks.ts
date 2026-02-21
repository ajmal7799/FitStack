import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createUserProfile,
  generateWorkoutPlan,
  getWorkoutPlan,
  generateDietPlan,
  getDietPlan,
  getUserProfile,
  getPersonalInfo,
  updateUserProfile,
  updatePersonalInfo,
  bookSlot,
  getAvailableSlots,
  changePassword,
  getBookedSlots,
  getBookedSlotDetails,
  cancelBookedSlot,
  joinSession
} from '../../service/user/userService';
import type { UserBodyMetricsPayload } from '../../types/UserBodyMetricsPayload';

export const useCreateUserProfile = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createUserProfile(formData),
  });
};

export const useGenerateWorkoutPlan = () => {
  return useMutation({
    mutationFn: () => generateWorkoutPlan(),
  });
};

export const useGetWorkoutPlan = () => {
  return useQuery({
    queryKey: ['workoutPlan'],
    queryFn: getWorkoutPlan,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1, // Only retry once on failure
  } );
};


export const useGetDietPlan = () => {
  return useQuery({
    queryKey: ['dietPlan', ],
    queryFn: getDietPlan,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1, // Only retry once on failure
  });
};

export const useGenerateDietPlan = () => {
  return useMutation({
    mutationFn: () => generateDietPlan(),
  });
};


export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn:getUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (formData: FormData) => updateUserProfile(formData),
  });
};


export const useGetPersonalInfo = () => {
  return useQuery({
    queryKey: ['personalInfo'],
    queryFn:getPersonalInfo,
  });
};


export const useUpdatePersonalInfo = () => {
  return useMutation({
    mutationFn: (data: UserBodyMetricsPayload) => updatePersonalInfo(data),
  });
};



export const useGetAvailableSlots = (date: string) => {
  return useQuery({
    queryKey: ['availableSlots', date], 
    queryFn: () => getAvailableSlots(date),
    
    // This ensures the query only runs if a date is actually provided
    // enabled: !!date, 
    
    // retry: false,
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useBookSlot = () => {
  return useMutation({
    mutationFn: (slotId: string) => bookSlot(slotId),
  });
};



export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string; }) => changePassword(data),
  });
};


export const useGetBookedSlots = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['bookedSlots', page, limit], 
    queryFn: () => getBookedSlots(page, limit),
  });
};

export const useGetBookedSlotDetails = (slotId: string) => {
  return useQuery({
    queryKey: ['bookedSlotDetails', slotId],
    queryFn: () => getBookedSlotDetails(slotId),
})
};

export const useCancelBookedSlot = () => {
  return useMutation({
    mutationFn: (data: { slotId: string; reason: string }) => cancelBookedSlot(data.slotId, data.reason),
  });
};

export const useJoinSession = () => {
  return useMutation({
    mutationFn: (slotId: string) => joinSession(slotId),
  });
};

