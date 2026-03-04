"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessExpiredSubscriptionsUseCase = void 0;
const membershipEnums_1 = require("../../../../domain/enum/membershipEnums");
const NotificationEnums_1 = require("../../../../domain/enum/NotificationEnums");
const userEnums_1 = require("../../../../domain/enum/userEnums");
class ProcessExpiredSubscriptionsUseCase {
    constructor(_membershipRepository, _userRepository, _createNotification) {
        this._membershipRepository = _membershipRepository;
        this._userRepository = _userRepository;
        this._createNotification = _createNotification;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const expiredMemberships = yield this._membershipRepository.findExpiredActiveMemberships();
            if (expiredMemberships.length === 0) {
                return;
            }
            console.log(`[Cron] Found ${expiredMemberships.length} expired memberships to process.`);
            for (const membership of expiredMemberships) {
                try {
                    // 1. Update membership status to Expired
                    yield this._membershipRepository.updateStatus(membership._id, membershipEnums_1.MembershipStatus.Expired);
                    // 2. Clear activeMembershipId on User
                    yield this._userRepository.updateActiveMembershipId(membership.userId, null);
                    // 3. Send Notification
                    yield this._createNotification.execute({
                        recipientId: membership.userId,
                        recipientRole: userEnums_1.UserRole.USER,
                        type: NotificationEnums_1.NotificationType.SUBSCRIPTION_EXPIRED,
                        title: "Subscription Expired 🕰️",
                        message: "Your subscription has expired. Purchase a new plan to continue enjoying premium features!",
                        relatedId: membership.stripeSubscriptionId,
                        isRead: false
                    });
                    console.log(`[Cron] Processed expiry for user: ${membership.userId}`);
                }
                catch (error) {
                    console.error(`[Cron Error] Failed to process expiry for membership ${membership._id}:`, error);
                }
            }
        });
    }
}
exports.ProcessExpiredSubscriptionsUseCase = ProcessExpiredSubscriptionsUseCase;
