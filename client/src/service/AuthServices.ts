import AxiosInstance from "../axios/axios";
import type { SignupPayload, LoginPayload } from "../types/AuthPayloads";

export const signupUser = async (data: SignupPayload) => {
  const response = await AxiosInstance.post("/signup", data);
  return response.data;
};

export const userVerifyOtp = async ({
  otp,
  values,
}: {
  otp: string;
  values: SignupPayload;
}) => {
  console.log(values, "values")
  const response = await AxiosInstance.post("/verify-otp", {
    otp,
    ...values,
  });
  return response.data;
};


export const loginUser = async (data: LoginPayload) => {
  const response = await AxiosInstance.post("/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await AxiosInstance.post("/logout")
  return response.data
}
