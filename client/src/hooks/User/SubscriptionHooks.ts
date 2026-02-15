import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getSubscriptionPage,
  checkoutSession,
  getActiveSubscription,
} from '../../service/user/subscription/SubscriptonService';
import type{ ActiveSubscriptionResponse } from '../../types/AcitveSubscriptionPlan';

export const useGetSubscriptionPlans = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['subscription', page, limit],
    queryFn: () => getSubscriptionPage(page, limit),
    keepPreviousData: true,
    refetchInterval: 500,
  } as any);
};

export const useCheckoutSession = () => {
  return useMutation({
    mutationFn: (PlanId: string) => checkoutSession(PlanId),
  });
};


export const useGetActiveSubscription = () => {
  return useQuery<ActiveSubscriptionResponse>({
    queryKey: ['active-subscription'],
    queryFn: getActiveSubscription,
    retry: false,           // 👈 Stop retrying on failure (Immediate response)
    refetchOnWindowFocus: false, // 👈 Prevent refetching when switching tabs
    staleTime: 5 * 60 * 1000,    // 👈 Keep data fresh for 5 mins
  });
};