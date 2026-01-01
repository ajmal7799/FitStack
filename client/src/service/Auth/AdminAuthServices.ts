import AxiosInstance from '../../axios/axios';
import type { LoginPayload } from '../../types/AuthPayloads';


export const adminLogin = async (data: LoginPayload) => {
  const response = await AxiosInstance.post('admin/login', data);
  return response.data;
};