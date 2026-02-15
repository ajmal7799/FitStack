import { SubscriptionDTO } from '../../../dto/admin/subscription/subscriptionDTO';
import { IGetSubscriptionEdit } from '../../../useCase/admin/subscription/IGetSubscriptionEdit';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';

export class GetSubscriptionEditPage implements IGetSubscriptionEdit {
    constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    ) {}

    async getSubscriptionEditPage(id: string): Promise<SubscriptionDTO> {

        const subscription = await this._subscriptionRepository.findById(id);

        if (!subscription) {
            throw new NotFoundException(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
        }
    
        return subscription as SubscriptionDTO;
    }
}
