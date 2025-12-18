import { Document, model, Types } from 'mongoose';
import membershipSchema from '../schema/membershipSchema';
import { MembershipStatus } from '../../../domain/enum/membershipEnums';

export interface IMembershipModel extends Document {
    _id: Types.ObjectId;
    userId: string;
    planId: string; 
    stripeCustomerId: string; 
    stripeSubscriptionId: string; 
    status: MembershipStatus;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export const membershipModel = model<IMembershipModel>('Membership', membershipSchema);