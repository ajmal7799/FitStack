"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const membershipEnums_1 = require("../../../domain/enum/membershipEnums");
const membershipSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    planId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        enum: Object.values(membershipEnums_1.MembershipStatus), // Enforces that the status is one of the valid Enum values
    },
    currentPeriodEnd: {
        type: Date,
        required: false,
        default: null,
    },
}, { timestamps: true });
exports.default = membershipSchema;
