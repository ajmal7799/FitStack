import { useMutation } from "@tanstack/react-query";
import type { SignupPayload,LoginPayload } from "../types/AuthPayloads";

import { signupUser,userVerifyOtp ,loginUser,logoutUser} from "../service/AuthServices";

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
