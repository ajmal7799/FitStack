"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionStatus_1 = require("../../../domain/enum/subscriptionStatus");
const subscriptionSchema = new mongoose_1.default.Schema({
    planName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    isActive: { type: String, enum: Object.values(subscriptionStatus_1.SubscriptionStatus), default: subscriptionStatus_1.SubscriptionStatus.ACTIVE },
    stripeProductId: { type: String, required: true, trim: true, unique: true },
    stripePriceId: { type: String, required: true, trim: true, unique: true },
}, {
    timestamps: true,
});
exports.default = subscriptionSchema;
