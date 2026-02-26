export enum MembershipStatus {
  // Subscription is active and paid
  Active = 'active',

  // Trial period, no payment yet
  Trialing = 'trialing',

  // Payment failed, Stripe is retrying (grace period)
  PastDue = 'past_due',

  // Payment failed permanently, subscription disabled
  Unpaid = 'unpaid',

  // Subscription canceled by user or system
  Canceled = 'canceled',

  // Initial payment failed, subscription not usable yet
  Incomplete = 'incomplete',

  // Initial payment never completed, Stripe expired it
  IncompleteExpired = 'incomplete_expired',

  // Subscription term has ended
  Expired = 'expired',
}
