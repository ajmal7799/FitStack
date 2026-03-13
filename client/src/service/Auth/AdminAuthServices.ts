import AxiosInstance from '../../axios/axios';
import type { LoginPayload } from '../../types/AuthPayloads';
import { API_ROUTES } from '../../constants/apiRoutes';

export const adminLogin = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.LOGIN, data);
  return response.data;
};