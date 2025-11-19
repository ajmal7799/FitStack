import { useMutation, useQuery } from "@tanstack/react-query";
import type { SignupPayload,LoginPayload } from "../types/AuthPayloads";

import { signupUser,userVerifyOtp ,loginUser, logoutUser, getAllUsers, updateUserStatus, getAllTrainers, updateTrainerStatus, userResendOtp} from "../service/AuthServices";



export const useUserSignup = () => {
    return useMutation({
        mutationFn: (data: SignupPayload) => signupUser(data),
    });
};

export const useUserVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ otp, values }: { otp: string; values: SignupPayload }) =>
      userVerifyOtp({ otp, values }),
  });
};

export const useUserResendOtp = () => {
  return useMutation({
    mutationFn: (email:string) => userResendOtp(email)
  })
}

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};


export const useGetAllUsers = (page: number, limit: number, status?: string, search?: string) => {
  // Temporary TS fix: cast options to any so 'keepPreviousData' is allowed
  return useQuery({
    queryKey: ["users", page, limit, status, search],
    queryFn: () => getAllUsers(page, limit, status, search),
    keepPreviousData: true,
    refetchInterval: 500, // poll every 5s (adjust as needed)
  } as any);
};


export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: ({
      userId, 
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateUserStatus({userId, currentStatus}),
  });
};


// admin trainer-management
export const useGetAllTrainers = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ["users", page, limit, status, search],
    queryFn: () => getAllTrainers(page, limit, status, search),
    keepPreviousData: true,
    refetchInterval: 500, // poll every 5s (adjust as needed)
  } as any);
}


export const useUpdateTrainerStatus = () => {
  return useMutation({
    mutationFn: ({
      userId, 
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateTrainerStatus({userId, currentStatus}),
  });
};