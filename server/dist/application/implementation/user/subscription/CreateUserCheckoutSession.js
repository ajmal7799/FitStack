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
const membershipEnums_1 = require("../../../../domain/enum/membershipEnums");
const WalletTransactionType_1 = require("../../../../domain/enum/WalletTransactionType");
const userEnums_1 = require("../../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
class CreateUserCheckoutSession {
    constructor(_subscriptionRepository, _userRepository, _checkoutService, _stripeService, _membershipRepository, _walletRepository, // ← add
    _createNotification) {
        this._subscriptionRepository = _subscriptionRepository;
        this._userRepository = _userRepository;
        this._checkoutService = _checkoutService;
        this._stripeService = _stripeService;
        this._membershipRepository = _membershipRepository;
        this._walletRepository = _walletRepository;
        this._createNotification = _createNotification;
    }
    ensureStripeCustomerId(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.stripeCustomerId)
                return user.stripeCustomerId;
            const newCustomerId = yield this._stripeService.createStripeCustomer(user.email, user._id);
            yield this._userRepository.updateStripeCustomerId(user._id, newCustomerId);
            return newCustomerId;
        });
    }
    execute(planId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._subscriptionRepository.findById(planId);
            if (!plan)
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);
            const stripePriceId = plan.stripePriceId;
            if (!stripePriceId)
                throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);
            const user = yield this._userRepository.findById(userId);
            if (!user)
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            // Check active membership
            if (user.activeMembershipId) {
                const membership = yield this._membershipRepository.findBySubscriptionId(user.activeMembershipId);
                const now = new Date();
                if (membership) {
                    const isStatusActive = membership.status === membershipEnums_1.MembershipStatus.Active;
                    const isNotExpired = membership.currentPeriodEnd ? new Date(membership.currentPeriodEnd) > now : true;
                    if (isStatusActive && isNotExpired) {
                        throw new exceptions_1.NotFoundException(error_1.SUBSCRIPTION_ERRORS.USER_ALREADY_HAS_ACTIVE_MEMBERSHIP);
                    }
                }
            }
            // ✅ Check wallet balance
            const wallet = yield this._walletRepository.getOrCreate(userId, 'user');
            const walletBalance = wallet.balance;
            const planPrice = plan.price;
            console.log(`💰 Wallet balance: ₹${walletBalance}, Plan price: ₹${planPrice}`);
            // ✅ Case 1: Wallet fully covers the plan price
            if (walletBalance >= planPrice) {
                yield this._walletRepository.debit(userId, 'user', planPrice, {
                    type: WalletTransactionType_1.WalletTransactionType.SUBSCRIPTION_PAYMENT,
                    amount: planPrice,
                    description: `Subscription payment for ${plan.planName} plan`,
                    relatedId: planId,
                });
                // Create membership directly (no Stripe needed)
                const now = new Date();
                const currentPeriodEnd = new Date(now.setMonth(now.getMonth() + plan.durationMonths));
                const membershipId = `wallet_${userId}_${Date.now()}`;
                yield this._membershipRepository.save({
                    _id: membershipId,
                    userId,
                    planId,
                    stripeSubscriptionId: membershipId,
                    stripeCustomerId: user.stripeCustomerId || '',
                    status: membershipEnums_1.MembershipStatus.Active,
                    currentPeriodEnd,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                yield this._userRepository.updateActiveMembershipId(userId, membershipId);
                // Notify user
                yield this._createNotification.execute({
                    recipientId: userId,
                    recipientRole: userEnums_1.UserRole.USER,
                    type: NotificationEnums_1.NotificationType.SUBSCRIPTION_PURCHASED,
                    title: '🎉 Subscription Activated!',
                    message: `Your ${plan.planName} plan has been activated using your wallet balance. Valid until ${currentPeriodEnd.toLocaleDateString()}.`,
                    relatedId: planId,
                    isRead: false,
                });
                console.log(`✅ Subscription paid fully with wallet: ₹${planPrice}`);
                return { paidWithWallet: true, amountDeducted: planPrice };
            }
            // ✅ Case 2: Wallet partially covers — deduct wallet, pay remaining via Stripe
            // (Stripe doesn't support partial payments natively, so we store wallet deduction in metadata)
            const stripeCustomerId = yield this.ensureStripeCustomerId(user);
            const sessionUrl = yield this._checkoutService.createCheckoutSessionUrl(stripePriceId, plan._id, userId, stripeCustomerId, walletBalance > 0 ? walletBalance : undefined);
            return { sessionUrl, amountDeducted: walletBalance > 0 ? walletBalance : 0 };
        });
    }
}
exports.CreateUserCheckoutSession = CreateUserCheckoutSession;
