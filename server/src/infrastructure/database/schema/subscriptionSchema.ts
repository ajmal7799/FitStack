import mongoose from 'mongoose';
import { SubscriptionStatus } from '../../../domain/enum/subscriptionStatus';

const subscriptionSchema = new mongoose.Schema(
    {
        planName: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        durationMonths: { type: Number, required: true },
        description: { type: String, required: true, trim: true },
        isActive: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.ACTIVE },

        stripeProductId: { type: String, required: true, trim: true, unique: true }, 

       
        stripePriceId: { type: String, required: true, trim: true, unique: true }, 
    },
    {
        timestamps: true,
    },
);
export default subscriptionSchema;