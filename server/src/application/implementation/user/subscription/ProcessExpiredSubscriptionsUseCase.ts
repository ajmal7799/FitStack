import { IProcessExpiredSubscriptionsUseCase } from "../../../useCase/user/subscription/IProcessExpiredSubscriptionsUseCase";
import { IMembershipRepository } from "../../../../domain/interfaces/repositories/IMembershipRepository";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { CreateNotification } from "../../notification/CreateNotification";
import { MembershipStatus } from "../../../../domain/enum/membershipEnums";
import { NotificationType } from "../../../../domain/enum/NotificationEnums";
import { UserRole } from "../../../../domain/enum/userEnums";

export class ProcessExpiredSubscriptionsUseCase implements IProcessExpiredSubscriptionsUseCase {
    constructor(
        private _membershipRepository: IMembershipRepository,
        private _userRepository: IUserRepository,
        private _createNotification: CreateNotification
    ) {}

    async execute(): Promise<void> {
        const expiredMemberships = await this._membershipRepository.findExpiredActiveMemberships();

        if (expiredMemberships.length === 0) {
            return;
        }

        console.log(`[Cron] Found ${expiredMemberships.length} expired memberships to process.`);

        for (const membership of expiredMemberships) {
            try {
                // 1. Update membership status to Expired
                await this._membershipRepository.updateStatus(membership._id!, MembershipStatus.Expired);

                // 2. Clear activeMembershipId on User
                await this._userRepository.updateActiveMembershipId(membership.userId, null);

                // 3. Send Notification
                await this._createNotification.execute({
                    recipientId: membership.userId,
                    recipientRole: UserRole.USER,
                    type: NotificationType.SUBSCRIPTION_EXPIRED,
                    title: "Subscription Expired 🕰️",
                    message: "Your subscription has expired. Purchase a new plan to continue enjoying premium features!",
                    relatedId: membership.stripeSubscriptionId,
                    isRead: false
                });

                console.log(`[Cron] Processed expiry for user: ${membership.userId}`);
            } catch (error) {
                console.error(`[Cron Error] Failed to process expiry for membership ${membership._id}:`, error);
            }
        }
    }
}
