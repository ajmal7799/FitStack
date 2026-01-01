import { useMutation, useQuery } from '@tanstack/react-query';
import type { SignupPayload, LoginPayload } from '../../types/AuthPayloads';

import {
  signupUser,
  userVerifyOtp,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserStatus,
  getAllTrainers,
  updateTrainerStatus,
  userResendOtp,
  forgotPassword,
  forgetPaaswordVerifyOtp,
  resetPassword,
  userGoogleLogin

} from '../../service/Auth/AuthServices';




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
    mutationFn: (email: string) => userResendOtp(email)
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn:(email: string) => forgotPassword(email)
  });
};

export const useForgetPasswordVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      forgetPaaswordVerifyOtp({ email, otp }),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ email, password, token }: { email: string; password: string; token: string }) =>
      resetPassword({ email, password, token }),
  });
};


export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};


export const useGetAllUsers = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['users', page, limit, status, search],
    queryFn: () => getAllUsers(page, limit, status, search),
  });
};


export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateUserStatus({ userId, currentStatus }),
  });
};


// admin trainer-management
export const useGetAllTrainers = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['users', page, limit, status, search],
    queryFn: () => getAllTrainers(page, limit, status, search),
  });
};


export const useUpdateTrainerStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateTrainerStatus({ userId, currentStatus }),
  });
};


export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: userGoogleLogin,
  });
};