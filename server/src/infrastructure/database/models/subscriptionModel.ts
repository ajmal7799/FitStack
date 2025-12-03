import subscriptionSchema from "../schema/subscriptionSchema";
import { Document, model, Types } from 'mongoose';
import { SubscriptionStatus } from "../../../domain/enum/subscriptionStatus";

export interface ISubscriptionModel extends Document {
    _id: Types.ObjectId;
    planName: string;
    price: number;
    durationMonths: number;
    description: string;
    isActive: SubscriptionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export const subscriptionModel = model<ISubscriptionModel>('Subscription', subscriptionSchema);
