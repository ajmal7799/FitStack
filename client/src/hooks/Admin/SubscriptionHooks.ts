import { useMutation, useQuery } from "@tanstack/react-query";

import { 
    getSubscriptionPage,
    createSubscription,
    updateSubscriptionStatus

 } from "../../service/admin/SubscriptionService/SubscriptionService";


 export const useGetSubscriptionPlans = (page: number, limit: number, status?: string, search?: string) => {
     return useQuery({
        queryKey: ['subscription', page, limit, status, search],
        queryFn: () => getSubscriptionPage(page, limit, status, search),
        keepPreviousData: true,
        refetchInterval: 500,
     } as any);
 }


 export const useCreateSubscriptionPlan = () => {
    return useMutation({
       mutationFn: (data: any) => createSubscription(data),
    })
 }

 export const useUpdateSubscriptionPlanStatus = () => {
    return useMutation({
       mutationFn: ({ id, status }: { id: string; status: string }) => updateSubscriptionStatus({ id, status }),
    })
 }