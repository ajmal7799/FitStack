
// import { string } from "zod/v3";
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

export const userResendOtp = async (email: string) => {
  const response = await AxiosInstance.post("/resend-otp", {
    email,
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


// Admin — Users
export const getAllUsers = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append("status",status);
  if(search) params.append("search", search);

  const response = await AxiosInstance.get(`/admin/users?${params.toString()}`);
  return response.data
}

export const updateUserStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
  "/admin/users/update-status",
    {
      userId,
      currentStatus,
    }
  );
  return response.data;
};


// Admin — Trainer
export const getAllTrainers = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append("status",status);
  if(search) params.append("search", search);

  const response = await AxiosInstance.get(`/admin/trainers?${params.toString()}`);
  return response.data
}


export const updateTrainerStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
  "/admin/trainers/update-status",
    {
      userId,
      currentStatus,
    }
  );
  return response.data;
};
