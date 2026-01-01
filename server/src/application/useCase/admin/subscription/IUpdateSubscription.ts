import { Subscription } from "../../../../domain/entities/admin/subscriptionEntities"
import { UpdateSubscriptionDTO } from "../../../dto/admin/subscription/updateSubscriptionDTO"
export interface IUpdateSubscription {
    updateSubscription(id: string, data: UpdateSubscriptionDTO): Promise<Subscription>
}