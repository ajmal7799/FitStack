import { Subscription } from '../../../../domain/entities/admin/subscriptionEntities';
import { CreateSubscriptionDTO } from '../../../dto/admin/subscription/createSubscriptionDTO';
export interface ICreateSubscription {
    createSubscription(data: CreateSubscriptionDTO): Promise<Subscription>;
}