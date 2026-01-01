import { Subscription } from '../../../../domain/entities/admin/subscriptionEntities';
import { UpdateSubscriptionDTO } from '../../../dto/admin/subscription/updateSubscriptionDTO';
import { IUpdateSubscription } from '../../../useCase/admin/subscription/IUpdateSubscription';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { AlreadyExisitingExecption } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
import { IStripeService } from '../../../../domain/interfaces/services/IStripeService';
import { SubscriptionMapper } from '../../../mappers/subscriptionMappers';

export class UpdateSubscription implements IUpdateSubscription {
  constructor(private _subscriptionRepository: ISubscriptionRepository, private _stripeService: IStripeService) {}

  async updateSubscription(id: string, data: UpdateSubscriptionDTO): Promise<Subscription> {
    const existingSub = await this._subscriptionRepository.findById(id);

    if (!existingSub) {
      throw new AlreadyExisitingExecption(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
    }

    if (data.planName && data.planName.trim().toUpperCase() !== existingSub.planName.toUpperCase()) {
      const subscription = await this._subscriptionRepository.findByName(data.planName);
      if (subscription) {
        throw new AlreadyExisitingExecption(SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
      }
    }

    let { stripeProductId, stripePriceId } = existingSub;

    if (data.planName || data.description) {
      await this._stripeService.updateProduct(stripeProductId!, {
        name: data.planName || existingSub.planName,
        description: data.description || existingSub.description,
      });
    }
    const priceChanged = data.price !== undefined && data.price !== existingSub.price;
    const durationChanged = data.durationMonths !== undefined && data.durationMonths !== existingSub.durationMonths;

    if (priceChanged || durationChanged) {
      const newPriceInCents = Math.round((data.price ?? existingSub.price) * 100);
      stripePriceId = await this._stripeService.createPrice(stripeProductId!, newPriceInCents, {
        interval: 'month',
        interval_count: data.durationMonths ?? existingSub.durationMonths,
      });
      await this._stripeService.archivePrice(existingSub.stripePriceId!);
    }
    const updateSubscription = SubscriptionMapper.toUpdateEntity(existingSub, {
      ...data,
      stripeProductId,
      stripePriceId,
    });

    let updatedSubscription = await this._subscriptionRepository.findByIdAndUpdate(updateSubscription);
    return updatedSubscription!;
    
  }
}
