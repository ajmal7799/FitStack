"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSubscriptionUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class ActiveSubscriptionUseCase {
    constructor(_subscriptionRepository, _userRepository, _membershipRepository) {
        this._subscriptionRepository = _subscriptionRepository;
        this._userRepository = _userRepository;
        this._membershipRepository = _membershipRepository;
    }
    showActiveSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const activeSubscription = yield this._membershipRepository.findActiveMembershipsWithSubscription(userId);
            if (!activeSubscription || activeSubscription.length === 0) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_ACTIVE_SUBSCRIPTION_FOUND);
            }
            const item = activeSubscription[0];
            if (!((_a = item === null || item === void 0 ? void 0 : item.membership) === null || _a === void 0 ? void 0 : _a._id) || !((_b = item.subscription) === null || _b === void 0 ? void 0 : _b._id)) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.NO_ACTIVE_SUBSCRIPTION_FOUND);
            }
            const now = new Date();
            const expiryDate = item.membership.currentPeriodEnd ? new Date(item.membership.currentPeriodEnd) : null;
            const dto = {
                membershipId: item.membership._id.toString(),
                userId: item.membership.userId,
                planId: item.subscription._id.toString(),
                status: item.membership.status,
                planName: item.subscription.planName,
                price: item.subscription.price,
                durationMonths: item.subscription.durationMonths,
                description: item.subscription.description,
                expiresAt: expiryDate || new Date(),
                isExpired: expiryDate ? now > expiryDate : false,
            };
            return dto;
        });
    }
}
exports.ActiveSubscriptionUseCase = ActiveSubscriptionUseCase;
