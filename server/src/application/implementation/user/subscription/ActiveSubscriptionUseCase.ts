import { ActiveSubscriptionPlanResponseDTO } from '../../../dto/user/subscription/ActiveSubscriptionPlanDTO';
import { IActiveSubscriptionUseCase } from '../../../useCase/user/subscription/IActiveSubscriptionUseCase';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';
import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';
import { MembershipStatus } from '../../../../domain/enum/membershipEnums';
export class ActiveSubscriptionUseCase implements IActiveSubscriptionUseCase {
  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    private _userRepository: IUserRepository,
    private _membershipRepository: IMembershipRepository
  ) {}

  async showActiveSubscription(userId: string): Promise<ActiveSubscriptionPlanResponseDTO | null> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    const activeSubscription = await this._membershipRepository.findActiveMembershipsWithSubscription(userId);

    if (!activeSubscription || activeSubscription.length === 0) {
      throw new NotFoundException(USER_ERRORS.NO_ACTIVE_SUBSCRIPTION_FOUND);
    }
    const item = activeSubscription[0];

    if (!item?.membership?._id || !item.subscription?._id) {
      throw new NotFoundException(USER_ERRORS.NO_ACTIVE_SUBSCRIPTION_FOUND);
    }

    const now = new Date();
    
    const expiryDate = item.membership.currentPeriodEnd ? new Date(item.membership.currentPeriodEnd) : null;

    const dto: ActiveSubscriptionPlanResponseDTO = {
      membershipId: item.membership._id.toString(),
      userId: item.membership.userId,
      planId: item.subscription._id.toString(),
      status: item.membership.status as MembershipStatus,
      planName: item.subscription.planName,
      price: item.subscription.price,
      durationMonths: item.subscription.durationMonths,
      description: item.subscription.description,
      expiresAt: expiryDate || new Date(),
      isExpired: expiryDate ? now > expiryDate : false,
    };

    return dto;
  }
}
