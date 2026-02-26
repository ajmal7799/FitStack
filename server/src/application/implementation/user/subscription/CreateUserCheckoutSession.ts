    import { IStripeCheckoutService } from '../../../../domain/interfaces/services/IStripeCheckoutService';
    import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
    import { NotFoundException } from '../../../constants/exceptions';
    import { SUBSCRIPTION_ERRORS, USER_ERRORS } from '../../../../shared/constants/error';
    import { CheckoutSessionDTO } from '../../../dto/user/subscription/checkoutSessionDTO';
    import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
    import { User } from '../../../../domain/entities/user/userEntities';
    import { IStripeService } from '../../../../domain/interfaces/services/IStripeService';
    import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';
    import { MembershipStatus } from '../../../../domain/enum/membershipEnums';
    import { IWalletRepository } from '../../../../domain/interfaces/repositories/IWalletRepository';
    import { CreateNotification } from '../../notification/CreateNotification';
import { WalletTransactionType } from '../../../../domain/enum/WalletTransactionType';
import { UserRole } from '../../../../domain/enum/userEnums';
import { NotificationType } from '../../../../domain/enum/NotificationEnums';

   export class CreateUserCheckoutSession {
    constructor(
        private _subscriptionRepository: ISubscriptionRepository,
        private _userRepository: IUserRepository,
        private _checkoutService: IStripeCheckoutService,
        private _stripeService: IStripeService,
        private _membershipRepository: IMembershipRepository,
        private _walletRepository: IWalletRepository,       // ← add
        private _createNotification: CreateNotification,    // ← add
    ) {}

    private async ensureStripeCustomerId(user: User): Promise<string> {
        if (user.stripeCustomerId) return user.stripeCustomerId;
        const newCustomerId = await this._stripeService.createStripeCustomer(user.email, user._id!);
        await this._userRepository.updateStripeCustomerId(user._id!, newCustomerId);
        return newCustomerId;
    }

    async execute(planId: string, userId: string): Promise<CheckoutSessionDTO> {
        const plan = await this._subscriptionRepository.findById(planId);
        if (!plan) throw new NotFoundException(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND);

        const stripePriceId = plan.stripePriceId;
        if (!stripePriceId) throw new NotFoundException(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);

        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);

        // Check active membership
        if (user.activeMembershipId) {
            const membership = await this._membershipRepository.findBySubscriptionId(user.activeMembershipId);
            const now = new Date();
            if (membership) {
                const isStatusActive = membership.status === MembershipStatus.Active;
                const isNotExpired = membership.currentPeriodEnd ? new Date(membership.currentPeriodEnd) > now : true;
                if (isStatusActive && isNotExpired) {
                    throw new NotFoundException(SUBSCRIPTION_ERRORS.USER_ALREADY_HAS_ACTIVE_MEMBERSHIP);
                }
            }
        }

        // ✅ Check wallet balance
        const wallet = await this._walletRepository.getOrCreate(userId, 'user');
        const walletBalance = wallet.balance;
        const planPrice = plan.price;

        console.log(`💰 Wallet balance: ₹${walletBalance}, Plan price: ₹${planPrice}`);

        // ✅ Case 1: Wallet fully covers the plan price
        if (walletBalance >= planPrice) {
            await this._walletRepository.debit(userId, 'user', planPrice, {
                type: WalletTransactionType.SUBSCRIPTION_PAYMENT,
                amount: planPrice,
                description: `Subscription payment for ${plan.planName} plan`,
                relatedId: planId,
            });

            // Create membership directly (no Stripe needed)
            const now = new Date();
            const currentPeriodEnd = new Date(now.setMonth(now.getMonth() + plan.durationMonths));

            const membershipId = `wallet_${userId}_${Date.now()}`;
            await this._membershipRepository.save({
                _id: membershipId,
                userId,
                planId,
                stripeSubscriptionId: membershipId,
                stripeCustomerId: user.stripeCustomerId || '',
                status: MembershipStatus.Active,
                currentPeriodEnd,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await this._userRepository.updateActiveMembershipId(userId, membershipId);

            // Notify user
            await this._createNotification.execute({
                recipientId: userId,
                recipientRole: UserRole.USER,
                type: NotificationType.SUBSCRIPTION_PURCHASED,
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
        const stripeCustomerId = await this.ensureStripeCustomerId(user);

        const sessionUrl = await this._checkoutService.createCheckoutSessionUrl(
            stripePriceId,
            plan._id,
            userId,
            stripeCustomerId,
            walletBalance > 0 ? walletBalance : undefined, // ← pass wallet amount as discount
        );

        return { sessionUrl, amountDeducted: walletBalance > 0 ? walletBalance : 0 };
    }
}