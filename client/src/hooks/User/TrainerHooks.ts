import { useMutation, useQuery } from '@tanstack/react-query';
import { getVerifiedTrainers } from '../../service/user/TrainersService';
import {
  getTrainerDetails,
  selectTrainer,
  getSelectedTrainer,
} from '../../service/user/userService';

export const useGetAllVerifiedTrainers = (
  page: number,
  limit: number,
  search?: string
) => {
  return useQuery({
    queryKey: ['trainer', page, limit, search],
    queryFn: () => getVerifiedTrainers(page, limit, search),
    // keepPreviousData: true,
    // refetchInterval: 500,
  });
};

export const useGetTrainerDetails = (id: string) => {
  console.log('🔵 Hook called with ID:', id);

  return useQuery({
    queryKey: ['trainerDetails', id],
    queryFn: async () => {
      const result = await getTrainerDetails(id);
      return result;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 3 * 60 * 1000,
  });
};

export const useSelectTrainer = () => {
  return useMutation({
    mutationFn: (trainerId: string) => selectTrainer(trainerId),
  });
};

export const useGetSelectedTrainer = () => {
  return useQuery({
    queryKey: ['selectedTrainer'],
    queryFn: getSelectedTrainer,
    retry: false,
    refetchOnWindowFocus: false, // 👈 Prevent refetching when switching tabs
    staleTime: 5 * 60 * 1000,
  });
};
