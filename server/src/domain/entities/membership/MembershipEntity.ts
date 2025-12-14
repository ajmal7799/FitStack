import { MembershipStatus } from "../../enum/membershipEnums";


export interface Membership {
    _id?: string; // MongoDB ObjectId, serves as the local identifier (the activeMembershipId)
    userId: string;
    planId: string; 

    // --- Stripe Identifiers (Updated by Webhook) ---

    /**
     * @description The customer ID associated with this membership (cus_XXXX).
     * This should match the stripeCustomerId on the User entity.
     */
    stripeCustomerId: string;
    
    /**
     * @description The ID of the subscription object in Stripe (sub_XXXX).
     * This is the primary key for communicating subscription status updates.
     */
    stripeSubscriptionId: string;

    // --- Status and Dates (Updated by Webhook) ---

    /**
     * @description The current status of the subscription, reflecting Stripe's state:
     * e.g., 'active', 'trialing', 'past_due', 'canceled', 'unpaid'.
     */
    status: MembershipStatus;
    
    /**
     * @description Timestamp of when the current billing period ends. Used for access expiry checks.
     * This field is updated on every renewal (via the 'invoice.paid' or 'customer.subscription.updated' webhook).
     */
    currentPeriodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
    
}