import { Subscription } from "../../domain/entities/admin/subscriptionEntities";
import { ISubscriptionModel } from "../../infrastructure/database/models/subscriptionModel";
import { CreateSubscriptionDTO } from "../dto/admin/subscription/createSubscriptionDTO";
import mongoose, { Mongoose } from 'mongoose';
import { SubscriptionDTO } from "../dto/admin/subscription/subscriptionDTO";
import { SubscriptionStatus } from "../../domain/enum/subscriptionStatus";

export class SubscriptionMapper  {
    // 1. ⬆️ Mapping from Domain Entity to Mongoose Document (for saving/updating)
    static toMongooseDocument(subscription: Subscription) {
        return {
            planName: subscription.planName,
            price: subscription.price,
            durationMonths: subscription.durationMonths,
            description: subscription.description,
            isActive: subscription.isActive,
            // 🔑 ADDED: Stripe IDs for persistence
            stripeProductId: subscription.stripeProductId,
            stripePriceId: subscription.stripePriceId,  
        };
    }

    // 2. ⬇️ Mapping from Mongoose Document to Domain Entity (for loading)
    static fromMongooseDocument(subscription: ISubscriptionModel) : Subscription {
        return {
            _id: subscription._id.toString(),
            planName: subscription.planName,
            price: subscription.price,
            durationMonths: subscription.durationMonths,
            description: subscription.description,
            isActive: subscription.isActive,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            // 🔑 ADDED: Stripe IDs from the database to the domain entity
            stripeProductId: subscription.stripeProductId,
            stripePriceId: subscription.stripePriceId,
        };
    }

    // 3. ➡️ Mapping from Create DTO to Domain Entity (for creation)
    static toEntity(subscription: CreateSubscriptionDTO & { stripeProductId: string, stripePriceId: string }) : Subscription {
        return {
            _id: new mongoose.Types.ObjectId().toString(),
            planName: subscription.planName.trim().toUpperCase(),
            price: subscription.price,
            durationMonths: subscription.durationMonths,
            description: subscription.description,
            isActive: SubscriptionStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            // 🔑 ADDED: Stripe IDs must be passed via the DTO during creation
            stripeProductId: subscription.stripeProductId,
            stripePriceId: subscription.stripePriceId,
        };
    }

    static toDTO(entity: Subscription) : SubscriptionDTO {
        return {
            _id: entity._id,
            planName: entity.planName,
            price: entity.price,
            durationMonths: entity.durationMonths,
            description: entity.description,
            isActive: entity.isActive,
            // Stripe IDs are usually not included in the simple DTO returned to the client
            // If needed, they could be added here as well.
        };
    }
}