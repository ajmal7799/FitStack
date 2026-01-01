import {
  submitTrainerVerification,
  getProfilePage,
  getVerificationPage,
  updateProfilePage,
  createSlot,
  getSlots,
  deleteSlots
} from "../../service/Trainer/TrainerService";

import { useMutation, useQuery, QueryClient,useQueryClient } from '@tanstack/react-query';

export const useSubmitTrainerVerification = () => {
  return useMutation({
    mutationFn: (formData: FormData) => submitTrainerVerification(formData),
  });
};

export const useGetTrainerProfile = () => {
  return useQuery({
    queryKey: ["trainerProfile"],
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
    queryKey: ["trainerVerification"],
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
      queryClient.invalidateQueries({ queryKey: ["trainerSlots"] });
      // Call custom onSuccess if provided
      options?.onSuccess?.();
    },
  });
};

export const useGetSlots = (page: number, limit: number, status?: string,) => {
  return useQuery({
    queryKey: ["trainerSlots", page, limit, status,],
    queryFn: () =>  getSlots(page, limit, status),
    retry: false,
    refetchOnWindowFocus: false, // 👈 Prevent refetching when switching tabs
    staleTime: 5 * 60 * 1000,
    // keepPreviousData: true,
  });
};

export const useDeleteSlots = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient(); // 👈 Must be inside the hook

  return useMutation({
    mutationFn: (slotId: string) => deleteSlots(slotId),
    onSuccess: () => {
      // 1. Refresh the list so the deleted slot disappears
      queryClient.invalidateQueries({ queryKey: ["trainerSlots"] });
      
      // 2. Run the custom success logic (like showing a toast)
      options?.onSuccess?.();
    },
  });
};