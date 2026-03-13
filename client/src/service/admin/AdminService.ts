import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const getAllVerification = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.GET_ALL_VERIFICATION}?${params.toString()}`,
  );
  return response.data;
};

export const getVerificationDetails = async (id: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_VERIFICATION_DETAILS}${id}`);
  return (response.data as any).data.verificationData;
};

export const approveVerification = async (id: string) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.ADMIN.APPROVE_VERIFICATION}/${id}/approve`,
  );
  return response.data;
};

export const rejectVerification = async (id: string, reason: string) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.ADMIN.REJECT_VERIFICATION}/${id}/reject`,
    { reason },
  );
  return response.data;
};

export const getSessionHistory = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.GET_SESSION}?${params.toString()}`,
  );
  return response.data;
};

export const getSessionHistoryDetails = async (sessionId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_SESSION_DETAILS}/${sessionId}`);
  return response.data;
};

export const getMembershipPage = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.GET_MEMBERSHIP}?${params.toString()}`,
  );
  return response.data;
};


export const getTrainerDetails = async (trainerId: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_TRAINER_DETAILS}/${trainerId}`);
  return response.data;
};


export const getRevenue = async (page: number, limit: number, search?: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append('search', search);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_REVENUE}?${params.toString()}`);
  return response.data;
}