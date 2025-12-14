import {useMutation, useQuery } from "@tanstack/react-query";

import {getSubscriptionPage,checkoutSession} from "../../service/user/subscription/SubscriptonService"


export const useGetSubscriptionPlans = (page: number, limit: number,) => {
    return useQuery({
       queryKey: ['subscription', page, limit],
       queryFn: () => getSubscriptionPage(page, limit,),
       keepPreviousData: true,
       refetchInterval: 500,
    } as any);
}


export const useCheckoutSession = () => {
    return useMutation({
        mutationFn: (PlanId: string) => checkoutSession(PlanId),
    })
}