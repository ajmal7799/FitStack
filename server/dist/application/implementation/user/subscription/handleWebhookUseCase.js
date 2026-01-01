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
exports.HandleWebhookUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const membershipEnums_1 = require("../../../../domain/enum/membershipEnums");
class HandleWebhookUseCase {
    constructor(_userRepository, _stripeCheckoutService, _membershipRepository) {
        this._userRepository = _userRepository;
        this._stripeCheckoutService = _stripeCheckoutService;
        this._membershipRepository = _membershipRepository;
    }
    excute(rawBody, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this._stripeCheckoutService.constructEventFromWebhook(rawBody, signature);
            switch (event.type) {
                case 'checkout.session.completed':
                    yield this.handleCheckoutSessionCompleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    yield this.handleInvoicePaymentSucceeded(event.data.object);
                    break;
                case 'invoice.payment_failed':
                    yield this.handleInvoicePaymentFailed(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    yield this.handleSubscriptionDeleted(event.data.object);
                    break;
            }
        });
    }
    handleCheckoutSessionCompleted(session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.localUserId;
            const planId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.localPlanId;
            const stripeSubscriptionId = session.subscription;
            const stripeCustomerId = session.customer;
            if (!userId || !planId) {
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.MISSING_METADATA);
            }
            const subscription = yield this._stripeCheckoutService.getSubscriptionDetails(stripeSubscriptionId);
            let currentPeriodEnd = null;
            const plan = subscription.items.data[0].plan;
            const intervalCount = plan.interval_count;
            const interval = plan.interval;
            const startDate = subscription.start_date * 1000;
            if (interval === 'month') {
                currentPeriodEnd = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + intervalCount));
            }
            else if (interval === 'year') {
                currentPeriodEnd = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() + intervalCount));
            }
            const membership = yield this._membershipRepository.save({
                _id: subscription.id,
                userId,
                planId,
                stripeSubscriptionId,
                stripeCustomerId,
                status: membershipEnums_1.MembershipStatus.Active,
                currentPeriodEnd,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            yield this._userRepository.updateActiveMembershipId(userId, stripeSubscriptionId);
        });
    }
    //Subscription renewal success
    handleInvoicePaymentSucceeded(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const stripeSubscription = invoice;
            const id = stripeSubscription.subscription;
            const membership = yield this._membershipRepository.findBySubscriptionId(id);
            if (membership) {
                yield this._membershipRepository.updateStatus(membership._id, membershipEnums_1.MembershipStatus.Active);
            }
        });
    }
    handleInvoicePaymentFailed(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const stripeSubscription = invoice;
            const id = stripeSubscription.subscription;
            const membership = yield this._membershipRepository.findBySubscriptionId(id);
            if (membership) {
                yield this._membershipRepository.updateStatus(membership._id, membershipEnums_1.MembershipStatus.PastDue);
            }
        });
    }
    handleSubscriptionDeleted(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const membership = yield this._membershipRepository.findBySubscriptionId(subscription.id);
            if (membership) {
                yield this._membershipRepository.updateStatus(membership._id, membershipEnums_1.MembershipStatus.Canceled);
                yield this._userRepository.updateActiveMembershipId(membership.userId, null);
            }
        });
    }
}
exports.HandleWebhookUseCase = HandleWebhookUseCase;
