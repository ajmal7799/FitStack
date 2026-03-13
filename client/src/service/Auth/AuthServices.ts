import AxiosInstance from '../../axios/axios';
import type { SignupPayload, LoginPayload } from '../../types/AuthPayloads';
import { API_ROUTES } from '../../constants/apiRoutes';


export const signupUser = async (data: SignupPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.SIGNUP, data);
  return response.data;
};


export const userVerifyOtp = async ({
  otp,
  values,
}: {
  otp: string;
  values: SignupPayload;
}) => {
  
  const response = await AxiosInstance.post(API_ROUTES.AUTH.VERIFY_OTP, {
    otp,
    ...values,
  });
  return response.data;
};

export const userResendOtp = async (email: string) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.RESEND_OTP, {
    email,
  });
  return response.data;
};


export const loginUser = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.LOGIN, data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD,{email});
  return response.data;
};

export const forgetPaaswordVerifyOtp = async ({
  email,
  otp,
}: {
  email:string;
  otp: string
}) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD_VERIFY_OTP,{otp,email});
  return response.data;
};

export const resetPassword = async ({
  email,
  password,
  token
}: {
  email:string;
  password: string,
  token:string
}) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD_RESET_PASSWORD,{email,password,token});
  return response.data;  
};




export const logoutUser = async () => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  return response.data;
};


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
  if(status) params.append('status',status);
  if(search) params.append('search', search);

  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.USERS}?${params.toString()}`);
  return response.data;
};

export const updateUserStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.ADMIN.USERS_UPDATE_STATUS,
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
  if(status) params.append('status',status);
  if(search) params.append('search', search);

  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.TRAINERS}?${params.toString()}`);
  return response.data;
};


export const updateTrainerStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.ADMIN.TRAINERS_UPDATE_STATUS,
    {
      userId,
      currentStatus,
    }
  );
  return response.data;
};

export const userGoogleLogin = async (data: {
  authorizationCode: string;
  role: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.GOOGLE_LOGIN,
    data
  );
  return response.data;
};