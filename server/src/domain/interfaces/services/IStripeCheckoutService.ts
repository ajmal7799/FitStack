import Stripe from 'stripe';
export interface IStripeCheckoutService {
  createCheckoutSessionUrl(priceId: string, planId: string, userId: string, stripeCustomerId: string, walletDiscount?: number  ): Promise<string>;
  constructEventFromWebhook(rawBody: Buffer, signature: string): Promise<Stripe.Event>;
  getSubscriptionDetails(subscriptionId: string): Promise<Stripe.Subscription>;
}
