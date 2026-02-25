import {
  submitTrainerVerification,
  getProfilePage,
  getVerificationPage,
  updateProfilePage,
  createSlot,
  getSlots,
  deleteSlots,
  CreateRecurringSlot,
  getBookedSlots,
  getBookedSlotDetails,
  getSessionHistory,
  getSessionHistoryDetails
} from '../../service/Trainer/TrainerService';

import { useMutation, useQuery, QueryClient,useQueryClient } from '@tanstack/react-query';

export const useSubmitTrainerVerification = () => {
  return useMutation({
    mutationFn: (formData: FormData) => submitTrainerVerification(formData),
  });
};

export const useGetTrainerProfile = () => {
  return useQuery({
    queryKey: ['trainerProfile'],
    queryFn: getProfilePage,
  });
};

export const useUpdateTrainerProfile = () => {
  return useMutation({
    mutationFn: (formData: FormData) => updateProfilePage(formData),
  });
};

export const useGetTrainerVerification = () => {
  return useQuery({
    queryKey: ['trainerVerification'],
    queryFn: getVerificationPage,
    keepPreviousData: true,
    refetchInterval: 500,
  } as any);
};

const options = {
  onSuccess: () => {
    // your custom onSuccess logic here
  }
};

const queryClient = new QueryClient();

export const useCreateSlot = () => {
  return useMutation({
    mutationFn: (startTime: string) => createSlot(startTime),
    onSuccess: () => {
      // Invalidate and refetch slots query
      queryClient.invalidateQueries({ queryKey: ['trainerSlots'] });
      // Call custom onSuccess if provided
      options?.onSuccess?.();
    },
  });
};



export const useGetSlots = (page: number, limit: number, status?: string,) => {
  return useQuery({
    queryKey: ['trainerSlots', page, limit, status,],
    queryFn: () =>  getSlots(page, limit, status),

  });
};

export const useDeleteSlots = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient(); // 👈 Must be inside the hook

  return useMutation({
    mutationFn: (slotId: string) => deleteSlots(slotId),
    onSuccess: () => {
      // 1. Refresh the list so the deleted slot disappears
      queryClient.invalidateQueries({ queryKey: ['trainerSlots'] });
      
      // 2. Run the custom success logic (like showing a toast)
      options?.onSuccess?.();
    },
  });
};

export const useCreateRecurringSlot = () => {
  return useMutation({
    mutationFn: (data: string | string[]) => CreateRecurringSlot( data),
  });
};

export const useGetBookedSlots = (page: number, limit: number, status?: string) => {
  return useQuery({
    queryKey: ['bookedSlots', page, limit, status],
    queryFn: () => getBookedSlots(page, limit, status),
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
      return 2000; // poll every 3s until terminal
    },
  });
};


export const useGetSessionHistory = (page: number, limit: number, status?: string) => {
  return useQuery({
    queryKey: ['sessionHistory', page, limit, status],
    queryFn: () => getSessionHistory(page, limit, status),  
  });
}

export const useGetSessionHistoryDetails = (sessionId: string) => {
  return useQuery({
    queryKey: ['sessionHistoryDetails', sessionId],
    queryFn: () => getSessionHistoryDetails(sessionId),  
  });
}