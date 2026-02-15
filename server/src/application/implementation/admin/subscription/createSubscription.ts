import { Subscription } from '../../../../domain/entities/admin/subscriptionEntities';
import { CreateSubscriptionDTO } from '../../../dto/admin/subscription/createSubscriptionDTO';
import { ICreateSubscription } from '../../../useCase/admin/subscription/ICreateSubscription';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { AlreadyExisitingExecption } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
import { SubscriptionMapper } from '../../../mappers/subscriptionMappers';
import { IStripeService } from '../../../../domain/interfaces/services/IStripeService';

export class CreateSubscription implements ICreateSubscription {
    constructor(private _subscriptionRepository: ISubscriptionRepository, private _stripeService: IStripeService) {}
    async createSubscription(data: CreateSubscriptionDTO): Promise<Subscription> {
        const subscription = await this._subscriptionRepository.findByName(data.planName);

        if (subscription) {
            throw new AlreadyExisitingExecption(SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
        }
        const description = data.description || `Plan: ${data.planName}`;

        const stripeProductId = await this._stripeService.createProduct(data.planName, description);

        const priceInCents = Math.round(data.price * 100);

        const stripePriceId = await this._stripeService.createPrice(stripeProductId, priceInCents, {
            interval: 'month',
            interval_count: data.durationMonths,
        });
        const subscriptionData = SubscriptionMapper.toEntity({
            ...data,
            stripeProductId,
            stripePriceId,
        });

        const newSubscription = await this._subscriptionRepository.save(subscriptionData);
        return newSubscription;
    }
}
