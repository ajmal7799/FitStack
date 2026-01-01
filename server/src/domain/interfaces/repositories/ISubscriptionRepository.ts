import { Subscription } from '../../entities/admin/subscriptionEntities';
import { IBaseRepository } from './IBaseRepository';
import { SubscriptionStatus } from '../../enum/subscriptionStatus';
export interface ISubscriptionRepository extends IBaseRepository <Subscription>{
    findByName(name: string): Promise<Subscription | null>
    findAllSubscriptions(skip?: number, limit?: number, status?: string, search?: string): Promise<Subscription[]>
    countSubscriptions(status?: string, search?: string): Promise<number>
    updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription | null>
    findAllSubscriptionsInUserSide(skip?: number, limit?: number,): Promise<Subscription[]>
    countSubscriptionsInUserSide(): Promise<number>
    findByIdAndUpdate(data: Subscription): Promise<Subscription | null>
    
}
