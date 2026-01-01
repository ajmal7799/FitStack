"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipStatus = void 0;
var MembershipStatus;
(function (MembershipStatus) {
    // Subscription is active and paid
    MembershipStatus["Active"] = "active";
    // Trial period, no payment yet
    MembershipStatus["Trialing"] = "trialing";
    // Payment failed, Stripe is retrying (grace period)
    MembershipStatus["PastDue"] = "past_due";
    // Payment failed permanently, subscription disabled
    MembershipStatus["Unpaid"] = "unpaid";
    // Subscription canceled by user or system
    MembershipStatus["Canceled"] = "canceled";
    // Initial payment failed, subscription not usable yet
    MembershipStatus["Incomplete"] = "incomplete";
    // Initial payment never completed, Stripe expired it
    MembershipStatus["IncompleteExpired"] = "incomplete_expired";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
