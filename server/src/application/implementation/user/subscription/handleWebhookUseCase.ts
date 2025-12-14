import Stripe from 'stripe';
import { IHandleWebhookUseCase } from '../../../useCase/user/subscription/IHandleWebhookUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IStripeCheckoutService } from '../../../../domain/interfaces/services/IStripeCheckoutService';
import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';

import { NotFoundException } from '../../../constants/exceptions';
import { SUBSCRIPTION_ERRORS } from '../../../../shared/constants/error';
import { MembershipStatus } from '../../../../domain/enum/membershipEnums';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _stripeCheckoutService: IStripeCheckoutService,
    private _membershipRepository: IMembershipRepository ,
  ) {}

  async excute(rawBody: Buffer, signature: string): Promise<void> {
    const event = await this._stripeCheckoutService.constructEventFromWebhook(rawBody, signature);
   
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

        case 'invoice.payment_succeeded':
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
   
    const userId = session.metadata?.localUserId;
    const planId = session.metadata?.localPlanId;
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    if (!userId || !planId) {
      throw new NotFoundException(SUBSCRIPTION_ERRORS.MISSING_METADATA);
    }

    const subscription = await this._stripeCheckoutService.getSubscriptionDetails(stripeSubscriptionId);

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
  }


  //Subscription renewal success
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    
    const stripeSubscription = invoice as Stripe.Invoice & { subscription?: string };
    const id = stripeSubscription.subscription as string;
    const membership = await this._membershipRepository.findBySubscriptionId(id);
    if (membership) {
      await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.Active);
    }
  }


  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const stripeSubscription = invoice as Stripe.Invoice & { subscription?: string };
    const id = stripeSubscription.subscription as string;
    const membership = await this._membershipRepository.findBySubscriptionId(id);
    if (membership) {
      await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.PastDue);
    }
  }


  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const membership = await this._membershipRepository.findBySubscriptionId(subscription.id);
    if (membership) {
      await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.Canceled);
      await this._userRepository.updateActiveMembershipId(membership.userId, null);
    }
  }

  
}
