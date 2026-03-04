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
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
const userEnums_1 = require("../../../../domain/enum/userEnums");
const WalletTransactionType_1 = require("../../../../domain/enum/WalletTransactionType");
class HandleWebhookUseCase {
    constructor(_userRepository, _stripeCheckoutService, _membershipRepository, _createNotification, _walletRepository) {
        this._userRepository = _userRepository;
        this._stripeCheckoutService = _stripeCheckoutService;
        this._membershipRepository = _membershipRepository;
        this._createNotification = _createNotification;
        this._walletRepository = _walletRepository;
    }
    excute(rawBody, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this._stripeCheckoutService.constructEventFromWebhook(rawBody, signature);
            console.log('✅ Event constructed:', event.type);
            switch (event.type) {
                case 'checkout.session.completed':
                    console.log('🔥 handling checkout.session.completed');
                    yield this.handleCheckoutSessionCompleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                case 'invoice.paid':
                case 'invoice_payment.paid':
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
            var _a, _b, _c;
            console.log('🔍 session.metadata:', session.metadata);
            console.log('🔍 session.subscription:', session.subscription);
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.localUserId;
            const planId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.localPlanId;
            const walletDiscount = parseFloat(((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.walletDiscount) || '0');
            const stripeSubscriptionId = session.subscription;
            const stripeCustomerId = session.customer;
            console.log('userId:', userId);
            console.log('planId:', planId);
            console.log('stripeSubscriptionId:', stripeSubscriptionId);
            if (!userId || !planId) {
                console.error('❌ Missing metadata - userId or planId is null');
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.MISSING_METADATA);
            }
            console.log('💰 walletDiscount:', walletDiscount);
            if (walletDiscount > 0) {
                console.log('🔄 Debiting wallet...');
                yield this._walletRepository.debit(userId, 'user', walletDiscount, {
                    type: WalletTransactionType_1.WalletTransactionType.SUBSCRIPTION_PAYMENT,
                    amount: walletDiscount,
                    description: `Wallet discount applied for subscription`,
                    relatedId: stripeSubscriptionId,
                });
                console.log('✅ Wallet debited');
            }
            console.log('🔄 Fetching subscription details...');
            const subscription = yield this._stripeCheckoutService.getSubscriptionDetails(stripeSubscriptionId);
            console.log('✅ Subscription fetched:', subscription.id);
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
            yield this._createNotification.execute({
                recipientId: userId,
                recipientRole: userEnums_1.UserRole.USER,
                type: NotificationEnums_1.NotificationType.SUBSCRIPTION_PURCHASED,
                title: "Subscription Activated! 🎉",
                message: `Your subscription has been successfully activated. Enjoy your premium features! Your plan is valid until ${currentPeriodEnd === null || currentPeriodEnd === void 0 ? void 0 : currentPeriodEnd.toLocaleDateString()}.`,
                relatedId: stripeSubscriptionId,
                isRead: false
            });
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
                yield this._createNotification.execute({
                    recipientId: membership.userId,
                    recipientRole: userEnums_1.UserRole.USER,
                    type: NotificationEnums_1.NotificationType.PAYMENT_SUCCESS,
                    title: "Subscription Renewed! 🚀",
                    message: "Your subscription has been successfully renewed. Thank you for staying with us!",
                    relatedId: membership.stripeSubscriptionId,
                    isRead: false
                });
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
                yield this._createNotification.execute({
                    recipientId: membership.userId,
                    recipientRole: userEnums_1.UserRole.USER,
                    type: NotificationEnums_1.NotificationType.PAYMENT_FAILED,
                    title: "Payment Failed 💳",
                    message: "We couldn't process your subscription payment. Please check your payment method.",
                    relatedId: membership.stripeSubscriptionId,
                    isRead: false
                });
            }
        });
    }
    handleSubscriptionDeleted(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const membership = yield this._membershipRepository.findBySubscriptionId(subscription.id);
            if (membership) {
                yield this._membershipRepository.updateStatus(membership._id, membershipEnums_1.MembershipStatus.Canceled);
                yield this._userRepository.updateActiveMembershipId(membership.userId, null);
                yield this._createNotification.execute({
                    recipientId: membership.userId,
                    recipientRole: userEnums_1.UserRole.USER,
                    type: NotificationEnums_1.NotificationType.SUBSCRIPTION_CANCELLED,
                    title: "Subscription Cancelled ⚠️",
                    message: "Your subscription has been cancelled. We're sorry to see you go!",
                    relatedId: membership.stripeSubscriptionId,
                    isRead: false
                });
            }
        });
    }
}
exports.HandleWebhookUseCase = HandleWebhookUseCase;
