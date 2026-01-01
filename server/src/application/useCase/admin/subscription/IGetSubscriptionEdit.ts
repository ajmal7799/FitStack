import { SubscriptionDTO } from "../../../dto/admin/subscription/subscriptionDTO";

export interface IGetSubscriptionEdit {
    getSubscriptionEditPage(id: string): Promise<SubscriptionDTO>;
}