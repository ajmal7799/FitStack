import { SubscriptionDTO } from '../../../dto/admin/subscription/subscriptionDTO';

export interface IUpdateSubscriptionStatus {
    updateSubscriptionStatus(id: string, status: string): Promise<{ subscription: SubscriptionDTO}>;
}