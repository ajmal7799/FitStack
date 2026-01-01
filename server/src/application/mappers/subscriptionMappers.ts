import { Subscription } from '../../domain/entities/admin/subscriptionEntities';
import { ISubscriptionModel } from '../../infrastructure/database/models/subscriptionModel';
import { CreateSubscriptionDTO } from '../dto/admin/subscription/createSubscriptionDTO';
import mongoose, { Mongoose } from 'mongoose';
import { SubscriptionDTO } from '../dto/admin/subscription/subscriptionDTO';
import { SubscriptionStatus } from '../../domain/enum/subscriptionStatus';

export class SubscriptionMapper {
  static toMongooseDocument(subscription: Subscription) {
    return {
      planName: subscription.planName,
      price: subscription.price,
      durationMonths: subscription.durationMonths,
      description: subscription.description,
      isActive: subscription.isActive,
      stripeProductId: subscription.stripeProductId,
      stripePriceId: subscription.stripePriceId,
    };
  }

  static fromMongooseDocument(subscription: ISubscriptionModel): Subscription {
    return {
      _id: subscription._id.toString(),
      planName: subscription.planName,
      price: subscription.price,
      durationMonths: subscription.durationMonths,
      description: subscription.description,
      isActive: subscription.isActive,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      stripeProductId: subscription.stripeProductId,
      stripePriceId: subscription.stripePriceId,
    };
  }

  static toEntity(
    subscription: CreateSubscriptionDTO & { stripeProductId: string; stripePriceId: string }
  ): Subscription {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      planName: subscription.planName.trim().toUpperCase(),
      price: subscription.price,
      durationMonths: subscription.durationMonths,
      description: subscription.description,
      isActive: SubscriptionStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeProductId: subscription.stripeProductId,
      stripePriceId: subscription.stripePriceId,
    };
  }

  static toUpdateEntity(
    existingSub: Subscription,
    updates: Partial<CreateSubscriptionDTO> & { stripeProductId?: string; stripePriceId?: string }
  ): Subscription {
    return {
      ...existingSub,
      planName: updates.planName ? updates.planName.trim().toUpperCase() : existingSub.planName,
      price: updates.price ?? existingSub.price,
      durationMonths: updates.durationMonths ?? existingSub.durationMonths,
      description: updates.description ?? existingSub.description,
      stripeProductId: updates.stripeProductId ?? existingSub.stripeProductId,
      stripePriceId: updates.stripePriceId ?? existingSub.stripePriceId,
      updatedAt: new Date(),
    };
  }

  static toDTO(entity: Subscription): SubscriptionDTO {
    return {
      _id: entity._id,
      planName: entity.planName,
      price: entity.price,
      durationMonths: entity.durationMonths,
      description: entity.description,
      isActive: entity.isActive,
    };
  }
}
