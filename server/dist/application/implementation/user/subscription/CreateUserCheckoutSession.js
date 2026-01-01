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
exports.CreateUserCheckoutSession = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
class CreateUserCheckoutSession {
    constructor(_subscriptionRepository, _userRepository, _checkoutService, _stripeService) {
        this._subscriptionRepository = _subscriptionRepository;
        this._userRepository = _userRepository;
        this._checkoutService = _checkoutService;
        this._stripeService = _stripeService;
    }
    ensureStripeCustomerId(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the ID already exists, use it.
            if (user.stripeCustomerId) {
                return user.stripeCustomerId;
            }
            // 1. Create Customer in Stripe (Infrastructure Service Call)
            // NOTE: We assume your IStripeCheckoutService has a method for this.
            const newCustomerId = yield this._stripeService.createStripeCustomer(user.email, user._id);
            // 2. Save the new ID to the local User record immediately (CRITICAL)
            yield this._userRepository.updateStripeCustomerId(user._id, newCustomerId);
            return newCustomerId;
        });
    }
    execute(planId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Fetch the Plan from the Database using the local planId
            const plan = yield this._subscriptionRepository.findById(planId);
            if (!plan) {
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
            }
            // 2. Validate essential Stripe ID
            const stripePriceId = plan.stripePriceId;
            const localPlanId = plan._id;
            if (!stripePriceId) {
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);
            }
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            if (user.activeMembershipId) {
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.USER_ALREADY_HAS_ACTIVE_MEMBERSHIP);
            }
            const stripeCustomerId = yield this.ensureStripeCustomerId(user);
            const sessionUrl = yield this._checkoutService.createCheckoutSessionUrl(stripePriceId, localPlanId, userId, stripeCustomerId);
            return {
                sessionUrl,
            };
        });
    }
}
exports.CreateUserCheckoutSession = CreateUserCheckoutSession;
