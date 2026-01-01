import mongoose from 'mongoose';
import { MembershipStatus } from '../../../domain/enum/membershipEnums';

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(MembershipStatus), // Enforces that the status is one of the valid Enum values
    },
    currentPeriodEnd: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export default membershipSchema;
