import { IUpdateSubscriptionStatus } from '../../../useCase/admin/subscription/IUpdateSubscriptionStatus';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { SubscriptionDTO } from '../../../dto/admin/subscription/subscriptionDTO';
import { SubscriptionStatus } from '../../../../domain/enum/subscriptionStatus';
import { NotFoundException } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
export class UpdateSubscriptionStatus implements IUpdateSubscriptionStatus { 
    constructor(
        private _subscriptionRepository: ISubscriptionRepository,
    ){}

    async updateSubscriptionStatus(id: string, status: string): Promise<{ subscription: SubscriptionDTO; }> {
        
        const newStatus = status === SubscriptionStatus.INACTIVE ? SubscriptionStatus.INACTIVE : SubscriptionStatus.ACTIVE;
        
        const updatedSubscription = await this._subscriptionRepository.updateStatus(id, newStatus);

        if (!updatedSubscription) {
            throw new NotFoundException(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        }

        return { subscription: updatedSubscription as SubscriptionDTO };
    }
}