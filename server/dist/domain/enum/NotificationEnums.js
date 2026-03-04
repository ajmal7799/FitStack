"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["SLOT_BOOKED"] = "SLOT_BOOKED";
    NotificationType["SESSION_CANCELLED"] = "SESSION_CANCELLED";
    NotificationType["VERIFICATION_APPROVED"] = "VERIFICATION_APPROVED";
    NotificationType["VERIFICATION_REJECTED"] = "VERIFICATION_REJECTED";
    NotificationType["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    NotificationType["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationType["FEEDBACK_RECEIVED"] = "FEEDBACK_RECEIVED";
    NotificationType["SUBSCRIPTION_PURCHASED"] = "SUBSCRIPTION_PURCHASED";
    NotificationType["SUBSCRIPTION_CANCELLED"] = "SUBSCRIPTION_CANCELLED";
    NotificationType["SUBSCRIPTION_EXPIRED"] = "SUBSCRIPTION_EXPIRED";
    NotificationType["REFUND"] = "REFUND";
    NotificationType["SESSION_COMMISSION"] = "SESSION_COMMISSION";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
