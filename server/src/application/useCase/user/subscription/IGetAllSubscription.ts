import { SubscriptionDTO } from '../../../dto/admin/subscription/subscriptionDTO';

export interface IGetAllSubscriptionUser {
    getAllSubscription(page: number, limit: number): Promise<{ subscriptions: SubscriptionDTO[]; totalSubscriptions: number; totalPages: number; currentPage: number; }>
}

