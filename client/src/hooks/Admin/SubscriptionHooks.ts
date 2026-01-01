import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { 
  getSubscriptionPage,
  createSubscription,
  updateSubscriptionStatus,
  getSubscriptionEditPage,
  updateSubscription
} from '../../service/admin/SubscriptionService/SubscriptionService';


export const useGetSubscriptionPlans = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['subscription', page, limit, status, search],
    queryFn: () => getSubscriptionPage(page, limit, status, search),
    keepPreviousData: true,
    refetchInterval: 500,
  } as any);
};


export const useCreateSubscriptionPlan = () => {
  return useMutation({
    mutationFn: (data: any) => createSubscription(data),
  });
};

export const useUpdateSubscriptionPlanStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSubscriptionStatus({ id, status }),
  });
};

export const useGetSubscriptionEditPage = (
  id: string, 
  options?: Omit<UseQueryOptions<any, Error, any, string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => getSubscriptionEditPage(id),
    enabled: !!id,
    ...options
  });
};

export const useUpdateSubscriptionPlan = () => {
  return useMutation({
    mutationFn: (data: any) => updateSubscription(data.id, data),
  });
};