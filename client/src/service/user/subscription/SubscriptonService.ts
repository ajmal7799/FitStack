import AxiosInstance from "../../../axios/axios";

export const getSubscriptionPage = async(page = 1,limit = 10,) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    const response = await AxiosInstance.get(`/subscriptions?${params.toString()}`);
    return response.data
}

export const checkoutSession = async (planId: string) => {
    const response = await AxiosInstance.post(`/checkout-session`,{planId});
    return response.data
}