import AxiosInstance from '../../../axios/axios';
import type { ActiveSubscriptionResponse } from '../../../types/AcitveSubscriptionPlan';
import { API_ROUTES } from '../../../constants/apiRoutes';

export const getSubscriptionPage = async(page = 1,limit = 10,) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await AxiosInstance.get(`${API_ROUTES.SUBSCRIPTION.GET_SUBSCRIPTIONS}?${params.toString()}`);
  return response.data;
};

export const checkoutSession = async (planId: string) => {
  const response = await AxiosInstance.post(API_ROUTES.SUBSCRIPTION.CHECKOUT_SESSION,{planId});
  return response.data;
};


export const getActiveSubscription = async (): Promise<ActiveSubscriptionResponse> => {
  const response = await AxiosInstance.get<ActiveSubscriptionResponse>(API_ROUTES.SUBSCRIPTION.GET_ACTIVE_SUBSCRIPTION);
  return response.data;
};
