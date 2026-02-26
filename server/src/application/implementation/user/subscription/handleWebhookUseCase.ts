import Stripe from 'stripe';
import { IHandleWebhookUseCase } from '../../../useCase/user/subscription/IHandleWebhookUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IStripeCheckoutService } from '../../../../domain/interfaces/services/IStripeCheckoutService';
import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';

import { NotFoundException } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
import { MembershipStatus } from '../../../../domain/enum/membershipEnums';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { CreateNotification } from '../../notification/CreateNotification';
import { NotificationType } from '../../../../domain/enum/NotificationEnums';
import { UserRole } from '../../../../domain/enum/userEnums';
import { WalletTransactionType } from '../../../../domain/enum/WalletTransactionType';
import { IWalletRepository } from '../../../../domain/interfaces/repositories/IWalletRepository';

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
    private _userRepository: IUserRepository,
    private _stripeCheckoutService: IStripeCheckoutService,
    private _membershipRepository: IMembershipRepository,
    private _createNotification: CreateNotification,
    private _walletRepository: IWalletRepository
    ) {}

    async excute(rawBody: Buffer, signature: string): Promise<void> {
        const event = await this._stripeCheckoutService.constructEventFromWebhook(rawBody, signature);
        console.log('✅ Event constructed:', event.type);

        switch (event.type) {
        case 'checkout.session.completed':
            console.log('🔥 handling checkout.session.completed');
            await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        case 'invoice.payment_succeeded':
        case 'invoice.paid':
        case 'invoice_payment.paid':    
            await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
            break;

        case 'invoice.payment_failed':
            await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
            break;

        case 'customer.subscription.deleted':
            await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
            break;

     
        }
    }

    private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
         console.log('🔍 session.metadata:', session.metadata);
    console.log('🔍 session.subscription:', session.subscription);
        
        const userId = session.metadata?.localUserId;
        const planId = session.metadata?.localPlanId;
        const walletDiscount = parseFloat(session.metadata?.walletDiscount || '0');
        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

         console.log('userId:', userId);
    console.log('planId:', planId);
    console.log('stripeSubscriptionId:', stripeSubscriptionId);

        if (!userId || !planId) {
            console.error('❌ Missing metadata - userId or planId is null');
            throw new NotFoundException(SUBSCRIPTION_ERRORS.MISSING_METADATA);
        }

        console.log('💰 walletDiscount:', walletDiscount);
        if (walletDiscount > 0) {
            console.log('🔄 Debiting wallet...');
        await this._walletRepository.debit(userId, 'user', walletDiscount, {
            type: WalletTransactionType.SUBSCRIPTION_PAYMENT,
            amount: walletDiscount,
            description: `Wallet discount applied for subscription`,
            relatedId: stripeSubscriptionId,
        });
        console.log('✅ Wallet debited');
        
    }
        console.log('🔄 Fetching subscription details...');
        const subscription = await this._stripeCheckoutService.getSubscriptionDetails(stripeSubscriptionId);
        console.log('✅ Subscription fetched:', subscription.id);

        let currentPeriodEnd: Date | null = null;

        const plan = subscription.items.data[0].plan;
        const intervalCount = plan.interval_count;
        const interval = plan.interval;

        const startDate = subscription.start_date * 1000;

        if (interval === 'month') {
            currentPeriodEnd = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + intervalCount));
        } else if (interval === 'year') {
            currentPeriodEnd = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() + intervalCount));
        }

        const membership = await this._membershipRepository.save({
            _id: subscription.id,
            userId,
            planId,
            stripeSubscriptionId,
            stripeCustomerId,
            status: MembershipStatus.Active,
            currentPeriodEnd,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this._userRepository.updateActiveMembershipId(userId, stripeSubscriptionId);

        await this._createNotification.execute({
            recipientId: userId,
            recipientRole: UserRole.USER,
            type: NotificationType.SUBSCRIPTION_PURCHASED,
            title: "Subscription Activated! 🎉",
            message: `Your subscription has been successfully activated. Enjoy your premium features! Your plan is valid until ${currentPeriodEnd?.toLocaleDateString()}.`,
            relatedId: stripeSubscriptionId,
            isRead: false
        });
    }


    //Subscription renewal success
    private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    
        const stripeSubscription = invoice as Stripe.Invoice & { subscription?: string };
        const id = stripeSubscription.subscription as string;
        const membership = await this._membershipRepository.findBySubscriptionId(id);
        if (membership) {
            await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.Active);

            await this._createNotification.execute({
                recipientId: membership.userId,
                recipientRole: UserRole.USER,
                type: NotificationType.PAYMENT_SUCCESS,
                title: "Subscription Renewed! 🚀",
                message: "Your subscription has been successfully renewed. Thank you for staying with us!",
                relatedId: membership.stripeSubscriptionId,
                isRead: false
            });
        }
    }


    private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        const stripeSubscription = invoice as Stripe.Invoice & { subscription?: string };
        const id = stripeSubscription.subscription as string;
        const membership = await this._membershipRepository.findBySubscriptionId(id);
        if (membership) {
            await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.PastDue);

            await this._createNotification.execute({
                recipientId: membership.userId,
                recipientRole: UserRole.USER,
                type: NotificationType.PAYMENT_FAILED,
                title: "Payment Failed 💳",
                message: "We couldn't process your subscription payment. Please check your payment method.",
                relatedId: membership.stripeSubscriptionId,
                isRead: false
            });
        }
    }


    private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        const membership = await this._membershipRepository.findBySubscriptionId(subscription.id);
        if (membership) {
            await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.Canceled);
            await this._userRepository.updateActiveMembershipId(membership.userId, null);

            await this._createNotification.execute({
                recipientId: membership.userId,
                recipientRole: UserRole.USER,
                type: NotificationType.SUBSCRIPTION_CANCELLED,
                title: "Subscription Cancelled ⚠️",
                message: "Your subscription has been cancelled. We're sorry to see you go!",
                relatedId: membership.stripeSubscriptionId,
                isRead: false
            });
        }
    }

  
}
