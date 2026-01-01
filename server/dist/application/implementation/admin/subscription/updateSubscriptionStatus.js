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
exports.UpdateSubscriptionStatus = void 0;
const subscriptionStatus_1 = require("../../../../domain/enum/subscriptionStatus");
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class UpdateSubscriptionStatus {
    constructor(_subscriptionRepository) {
        this._subscriptionRepository = _subscriptionRepository;
    }
    updateSubscriptionStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const newStatus = status === subscriptionStatus_1.SubscriptionStatus.INACTIVE ? subscriptionStatus_1.SubscriptionStatus.INACTIVE : subscriptionStatus_1.SubscriptionStatus.ACTIVE;
            const updatedSubscription = yield this._subscriptionRepository.updateStatus(id, newStatus);
            if (!updatedSubscription) {
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
            }
            return { subscription: updatedSubscription };
        });
    }
}
exports.UpdateSubscriptionStatus = UpdateSubscriptionStatus;
