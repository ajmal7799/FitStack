"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionStatus_1 = require("../../domain/enum/subscriptionStatus");
class SubscriptionMapper {
    static toMongooseDocument(subscription) {
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
    static fromMongooseDocument(subscription) {
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
    static toEntity(subscription) {
        return {
            _id: new mongoose_1.default.Types.ObjectId().toString(),
            planName: subscription.planName.trim().toUpperCase(),
            price: subscription.price,
            durationMonths: subscription.durationMonths,
            description: subscription.description,
            isActive: subscriptionStatus_1.SubscriptionStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            stripeProductId: subscription.stripeProductId,
            stripePriceId: subscription.stripePriceId,
        };
    }
    static toUpdateEntity(existingSub, updates) {
        var _a, _b, _c, _d, _e;
        return Object.assign(Object.assign({}, existingSub), { planName: updates.planName ? updates.planName.trim().toUpperCase() : existingSub.planName, price: (_a = updates.price) !== null && _a !== void 0 ? _a : existingSub.price, durationMonths: (_b = updates.durationMonths) !== null && _b !== void 0 ? _b : existingSub.durationMonths, description: (_c = updates.description) !== null && _c !== void 0 ? _c : existingSub.description, stripeProductId: (_d = updates.stripeProductId) !== null && _d !== void 0 ? _d : existingSub.stripeProductId, stripePriceId: (_e = updates.stripePriceId) !== null && _e !== void 0 ? _e : existingSub.stripePriceId, updatedAt: new Date() });
    }
    static toDTO(entity) {
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
exports.SubscriptionMapper = SubscriptionMapper;
