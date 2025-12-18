import {
  submitTrainerVerification,
  getProfilePage,
  getVerificationPage,
} from "../../service/Trainer/TrainerService";

import { useMutation, useQuery } from "@tanstack/react-query";


export const useSubmitTrainerVerification = () => {
  return useMutation({
    mutationFn: (formData: FormData) => submitTrainerVerification(formData),
  });
};


export const useGetTrainerProfile = () => {
  return useQuery({
    queryKey: ["trainerProfile"],
    queryFn: getProfilePage,
     keepPreviousData: true,
    refetchInterval: 500, 
  } as any);
};


export const useGetTrainerVerification = () => {
  return useQuery({
    queryKey: ["trainerVerification"],
    queryFn: getVerificationPage,
     keepPreviousData: true,
    refetchInterval: 500, 
  } as any);
};
