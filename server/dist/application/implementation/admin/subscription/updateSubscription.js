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
exports.UpdateSubscription = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const subscriptionMappers_1 = require("../../../mappers/subscriptionMappers");
class UpdateSubscription {
    constructor(_subscriptionRepository, _stripeService) {
        this._subscriptionRepository = _subscriptionRepository;
        this._stripeService = _stripeService;
    }
    updateSubscription(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const existingSub = yield this._subscriptionRepository.findById(id);
            if (!existingSub) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
            }
            if (data.planName && data.planName.trim().toUpperCase() !== existingSub.planName.toUpperCase()) {
                const subscription = yield this._subscriptionRepository.findByName(data.planName);
                if (subscription) {
                    throw new exceptions_1.AlreadyExisitingExecption(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
                }
            }
            let { stripeProductId, stripePriceId } = existingSub;
            if (data.planName || data.description) {
                yield this._stripeService.updateProduct(stripeProductId, {
                    name: data.planName || existingSub.planName,
                    description: data.description || existingSub.description,
                });
            }
            const priceChanged = data.price !== undefined && data.price !== existingSub.price;
            const durationChanged = data.durationMonths !== undefined && data.durationMonths !== existingSub.durationMonths;
            if (priceChanged || durationChanged) {
                const newPriceInCents = Math.round(((_a = data.price) !== null && _a !== void 0 ? _a : existingSub.price) * 100);
                stripePriceId = yield this._stripeService.createPrice(stripeProductId, newPriceInCents, {
                    interval: 'month',
                    interval_count: (_b = data.durationMonths) !== null && _b !== void 0 ? _b : existingSub.durationMonths,
                });
                yield this._stripeService.archivePrice(existingSub.stripePriceId);
            }
            const updateSubscription = subscriptionMappers_1.SubscriptionMapper.toUpdateEntity(existingSub, Object.assign(Object.assign({}, data), { stripeProductId,
                stripePriceId }));
            let updatedSubscription = yield this._subscriptionRepository.findByIdAndUpdate(updateSubscription);
            return updatedSubscription;
        });
    }
}
exports.UpdateSubscription = UpdateSubscription;
