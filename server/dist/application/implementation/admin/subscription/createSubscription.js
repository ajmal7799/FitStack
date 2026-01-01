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
exports.CreateSubscription = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const subscriptionMappers_1 = require("../../../mappers/subscriptionMappers");
class CreateSubscription {
    constructor(_subscriptionRepository, _stripeService) {
        this._subscriptionRepository = _subscriptionRepository;
        this._stripeService = _stripeService;
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this._subscriptionRepository.findByName(data.planName);
            if (subscription) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
            }
            const description = data.description || `Plan: ${data.planName}`;
            const stripeProductId = yield this._stripeService.createProduct(data.planName, description);
            const priceInCents = Math.round(data.price * 100);
            const stripePriceId = yield this._stripeService.createPrice(stripeProductId, priceInCents, {
                interval: 'month',
                interval_count: data.durationMonths,
            });
            const subscriptionData = subscriptionMappers_1.SubscriptionMapper.toEntity(Object.assign(Object.assign({}, data), { stripeProductId,
                stripePriceId }));
            const newSubscription = yield this._subscriptionRepository.save(subscriptionData);
            return newSubscription;
        });
    }
}
exports.CreateSubscription = CreateSubscription;
