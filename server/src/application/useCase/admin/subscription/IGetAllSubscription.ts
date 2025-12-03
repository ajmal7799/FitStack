import { SubscriptionDTO } from "../../../dto/admin/subscription/subscriptionDTO";

export interface IGetAllSubscription {
    getAllSubscription(
        page: number,
        limit: number,
        status?: string,
        search?: string
    ): Promise<{subscriptions: SubscriptionDTO[]; totalSubscriptions: number; totalPages: number; currentPage: number}>;
}