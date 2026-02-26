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

  async updateProduct(productId: string, data: { name?: string; description?: string }): Promise<void> {
    await stripe.products.update(productId, {
      name: data.name,
      description: data.description,
    });
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

  async archivePrice(priceId: string): Promise<void> {
    await stripe.prices.update(priceId, { active: false });
  }

  async createCheckoutSessionUrl(
    priceId: string,
    planId: string,
    userId: string,
    stripeCustomerId: string,
    walletDiscount?: number
  ): Promise<string> {
    const successUrl = `${CONFIG.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${CONFIG.FRONTEND_URL}/plans`;

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

    if (walletDiscount && walletDiscount > 0) {
      // Fetch the price to check amount — prevent coupon >= plan price
      const stripePrice = await stripe.prices.retrieve(priceId);
      const planAmountInPaise = stripePrice.unit_amount ?? 0;
      const discountInPaise = Math.round(walletDiscount * 100);

      // ✅ Only apply coupon if discount is strictly less than plan price
      if (discountInPaise > 0 && discountInPaise < planAmountInPaise) {
        const coupon = await stripe.coupons.create({
          amount_off: discountInPaise,
          currency: 'usd', // ✅ match your price currency
          duration: 'once',
          name: 'Wallet Balance Discount',
        });
        discounts = [{ coupon: coupon.id }];
        console.log(`🎟️ Coupon created: ₹${walletDiscount} discount for user ${userId}`);
      } else {
        console.warn(`⚠️ Skipping coupon: discount ₹${walletDiscount} >= plan price, handle via wallet-only path`);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer: stripeCustomerId,
      metadata: {
        localPlanId: planId,
        localUserId: userId,
        walletDiscount: walletDiscount?.toString() || '0',
      },
      ...(discounts.length > 0 && { discounts }),
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
