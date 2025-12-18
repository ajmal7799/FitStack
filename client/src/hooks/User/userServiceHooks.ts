import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserProfile,
  generateWorkoutPlan,
  getWorkoutPlan,
  generateDietPlan,
  getDietPlan,
  getUserProfile,
  getPersonalInfo,
} from "../../service/user/userService";

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
    queryKey: ["workoutPlan"],
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
    queryKey: ["dietPlan", ],
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
    queryKey: ["userProfile"],
    queryFn:getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1, 
  });
}


export const useGetPersonalInfo = () => {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn:getPersonalInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1,
  })
}

