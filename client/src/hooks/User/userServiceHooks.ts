import { useMutation, useQuery, useQueryClient  } from '@tanstack/react-query';
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
  joinSession,
  getSessionHistory,
  getSessionHistoryDetails,
  feedback,
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  getWallet
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


export const useGetBookedSlots = (page: number, limit: number, status?: string) => {
  return useQuery({
    queryKey: ['bookedSlots', page, limit, status],    
    queryFn: () => getBookedSlots(page, limit, status),
     staleTime: 0,
    // placeholderData: keepPreviousData,
  }); 
};

export const useGetBookedSlotDetails = (slotId: string) => {
  return useQuery({
    queryKey: ["bookedSlotDetails", slotId],
    queryFn: () => getBookedSlotDetails(slotId),
    staleTime: 0,
    enabled: !!slotId,
    refetchOnWindowFocus: true, // ✅ refetch when user tabs back
    // ✅ Poll every 3s but ONLY when status is not yet terminal
    refetchInterval: (query) => {
      const status = query.state.data?.data?.result?.slotStatus;
      const terminalStatuses = ["completed", "cancelled", "missed"];
      // Stop polling once we have a terminal status
      if (status && terminalStatuses.includes(status)) return false;
      return 3000; // poll every 3s until terminal
    },
  });
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

export const useGetSessionHistory = (page: number, limit: number, status?: string) => {
  return useQuery({
    queryKey: ['sessionHistory', page, limit, status],
    queryFn: () => getSessionHistory(page, limit, status),
  });
};

export const useGetSessionHistoryDetails = (sessionId: string) => {
  return useQuery({
    queryKey: ['sessionHistoryDetails', sessionId],
    queryFn: () => getSessionHistoryDetails(sessionId),
  });
};

export const useFeedback = () => {
  return useMutation({
    mutationFn: (data: {sessionId: string; rating: number; review: string }) => feedback(data),
  });
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
};


export const useGetWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
    });
};
