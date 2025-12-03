import { SubscriptionDTO } from "../../../dto/admin/subscription/subscriptionDTO";
import { IGetAllSubscriptionUser } from "../../../useCase/user/subscription/IGetAllSubscription";
import { ISubscriptionRepository } from "../../../../domain/interfaces/repositories/ISubscriptionRepository";
import { SubscriptionMapper } from "../../../mappers/subscriptionMappers";

export class GetAllSubscriptionUser implements IGetAllSubscriptionUser {
  constructor(
    private _subscriptionRepository: ISubscriptionRepository
  ) {}

  async getAllSubscription(page: number, limit: number): Promise<{ subscriptions: SubscriptionDTO[]; totalSubscriptions: number; totalPages: number; currentPage: number; }> {

      const skip = (page - 1) * limit;

      const [subscriptions, totalSubscriptions] = await Promise.all([
          this._subscriptionRepository.findAllSubscriptionsInUserSide(skip, limit),
          this._subscriptionRepository.countSubscriptionsInUserSide(),
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