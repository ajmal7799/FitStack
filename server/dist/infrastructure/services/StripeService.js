"use strict";
// infrastructure/services/StripeService.ts (Concrete Implementation)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config/config");
const stripe = new stripe_1.default(config_1.CONFIG.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
});
class StripeService {
    createStripeCustomer(email, localUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield stripe.customers.create({
                email: email,
                metadata: {
                    localUserId: localUserId,
                },
            });
            return customer.id;
        });
    }
    createProduct(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield stripe.products.create({
                name: name,
                description: description,
                active: true,
            });
            return product.id;
        });
    }
    updateProduct(productId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield stripe.products.update(productId, {
                name: data.name,
                description: data.description
            });
        });
    }
    createPrice(productId, amount, recurring) {
        return __awaiter(this, void 0, void 0, function* () {
            const price = yield stripe.prices.create({
                unit_amount: amount,
                currency: 'usd',
                product: productId,
                recurring: {
                    interval: recurring.interval,
                    interval_count: recurring.interval_count,
                },
            });
            return price.id;
        });
    }
    archivePrice(priceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield stripe.prices.update(priceId, { active: false });
        });
    }
    createCheckoutSessionUrl(priceId, planId, userId, stripeCustomerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const successUrl = `${config_1.CONFIG.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${config_1.CONFIG.FRONTEND_URL}/plans`;
            const session = yield stripe.checkout.sessions.create({
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
            return session.url;
        });
    }
    constructEventFromWebhook(rawBody, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookSecret = config_1.CONFIG.STRIPE_WEBHOOK_SECRET;
            const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
            return event;
        });
    }
    getSubscriptionDetails(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield stripe.subscriptions.retrieve(subscriptionId);
            return subscription;
        });
    }
}
exports.StripeService = StripeService;
