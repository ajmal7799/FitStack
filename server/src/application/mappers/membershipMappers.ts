import { Membership } from '../../domain/entities/membership/MembershipEntity';
import { IMembershipModel } from '../../infrastructure/database/models/membershipModel';
import mongoose, { Mongoose } from 'mongoose';
import { MembershipStatus } from '../../domain/enum/membershipEnums';

export class MembershipMapper {

    static toMongooseDocument(membership: Membership) {
        return {
            userId: new mongoose.Types.ObjectId(membership.userId),
            planId: new mongoose.Types.ObjectId(membership.planId),
            stripeCustomerId: membership.stripeCustomerId,
            stripeSubscriptionId: membership.stripeSubscriptionId,
            status: membership.status,
            currentPeriodEnd: membership.currentPeriodEnd,
        };
    }

    static fromMongooseDocument(doc: IMembershipModel): Membership {
        return {
            _id: doc._id.toString(),
            userId: doc.userId.toString(),
            planId: doc.planId.toString(),
            stripeCustomerId: doc.stripeCustomerId,
            stripeSubscriptionId: doc.stripeSubscriptionId,
            status: doc.status as MembershipStatus,
            currentPeriodEnd: doc.currentPeriodEnd,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

   
}