// infrastructure/services/StripeService.ts (Concrete Implementation)

import Stripe from 'stripe';
import { IStripeService } from '../../domain/interfaces/services/IStripeService';
import { IStripeCheckoutService } from '../../domain/interfaces/services/IStripeCheckoutService';
import { CONFIG } from '../config/config';

const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export class StripeService implements IStripeService, IStripeCheckoutService {
  async createStripeCustomer(email: string, localUserId: string): Promise<string> {
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        localUserId: localUserId,
      },
    });
    return customer.id;
  }

  async createProduct(name: string, description: string): Promise<string> {
    const product = await stripe.products.create({
      name: name,
      description: description,
      active: true,
    });
    return product.id;
  }

  async createPrice(
    productId: string,
    amount: number,
    recurring: {
      interval: 'month' | 'year';
      interval_count: number;
    }
  ): Promise<string> {
    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: 'usd',
      product: productId,
      recurring: {
        interval: recurring.interval,
        interval_count: recurring.interval_count,
      },
    });
    return price.id;
  }

  async createCheckoutSessionUrl(
    priceId: string,
    planId: string,
    userId: string,
    stripeCustomerId: string
  ): Promise<string> {
    const successUrl = `${CONFIG.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${CONFIG.FRONTEND_URL}/plans`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      customer: stripeCustomerId,

      // 3. Pass local IDs to the webhook handler via metadata (CRITICAL for persistence)
      metadata: {
        localPlanId: planId,
        localUserId: userId,
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session.url!;
  }
  async constructEventFromWebhook(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = CONFIG.STRIPE_WEBHOOK_SECRET!;
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    return event;
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  }
}
