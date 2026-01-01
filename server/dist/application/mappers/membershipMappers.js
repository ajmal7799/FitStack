"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipMapper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MembershipMapper {
    static toMongooseDocument(membership) {
        return {
            userId: new mongoose_1.default.Types.ObjectId(membership.userId),
            planId: new mongoose_1.default.Types.ObjectId(membership.planId),
            stripeCustomerId: membership.stripeCustomerId,
            stripeSubscriptionId: membership.stripeSubscriptionId,
            status: membership.status,
            currentPeriodEnd: membership.currentPeriodEnd,
        };
    }
    static fromMongooseDocument(doc) {
        return {
            _id: doc._id.toString(),
            userId: doc.userId.toString(),
            planId: doc.planId.toString(),
            stripeCustomerId: doc.stripeCustomerId,
            stripeSubscriptionId: doc.stripeSubscriptionId,
            status: doc.status,
            currentPeriodEnd: doc.currentPeriodEnd,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
exports.MembershipMapper = MembershipMapper;
