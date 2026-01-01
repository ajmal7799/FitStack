import { IGetAllSubscription } from '../../../useCase/admin/subscription/IGetAllSubscription';
import { SubscriptionDTO } from '../../../dto/admin/subscription/subscriptionDTO';
import { SubscriptionMapper } from '../../../mappers/subscriptionMappers';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';

export class GetAllSubscription implements IGetAllSubscription {
    constructor(private _subscriptionRepository: ISubscriptionRepository) {}

    async getAllSubscription(page: number, limit: number, status?: string, search?: string): Promise<{ subscriptions: SubscriptionDTO[]; totalSubscriptions: number; totalPages: number; currentPage: number; }> {
        const skip = (page - 1) * limit;

        const [subscriptions, totalSubscriptions] = await Promise.all([
            this._subscriptionRepository.findAllSubscriptions(skip, limit, status, search),
            this._subscriptionRepository.countSubscriptions(status, search),
        ]);
        
        const subscriptionDTOs = subscriptions.map((subscription) => SubscriptionMapper.toDTO(subscription));

        return {
            subscriptions: subscriptionDTOs,
            totalSubscriptions,
            totalPages: Math.ceil(totalSubscriptions / limit),
            currentPage: page,
        };
    }
}