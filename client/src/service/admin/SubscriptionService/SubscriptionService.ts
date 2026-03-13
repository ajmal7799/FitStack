import AxiosInstance from '../../../axios/axios';
import { API_ROUTES } from '../../../constants/apiRoutes';

export const getSubscriptionPage = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.GETSUBSCRIPTION}?${params.toString()}`
  );
  return response.data;
};

export const createSubscription = async (data: any) => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.CREATE_SUBSCRIPTION, data);
  return response.data;
};

export const updateSubscriptionStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.UPDATE_SUBSCRIPTION_STATUS,
    { id, status }
  );
  return response.data;
};

export const getSubscriptionEditPage = async (id: string) => {
  const response = await AxiosInstance.get(`${API_ROUTES.ADMIN.GET_SUBSCRIPTION_EDIT_PAGE}${id}`);
  return response.data;
};


export const updateSubscription = async (id: string, data: any) => {
  const response = await AxiosInstance.put(`${API_ROUTES.ADMIN.UPDATE_SUBSCRIPTION}${id}`, data);
  return response.data;
};
