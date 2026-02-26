import { IBookedSlotCancelUseCase } from '../../../useCase/user/booking/IBookedSlotCancelUseCase';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  DataMissingExecption,
} from '../../../constants/exceptions';
import { SlotStatus } from '../../../../domain/enum/SlotEnums';
import { IVideoCallRepository } from '../../../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCallStatus } from '../../../../domain/enum/videoCallEnums';
import { UserRole } from '../../../../domain/enum/userEnums';
import { CreateNotification } from '../../notification/CreateNotification';
import { NotificationType } from '../../../../domain/enum/NotificationEnums';
import { IWalletRepository } from '../../../../domain/interfaces/repositories/IWalletRepository';
import { IMembershipRepository } from '../../../../domain/interfaces/repositories/IMembershipRepository';
import { ISubscriptionRepository } from '../../../../domain/interfaces/repositories/ISubscriptionRepository';
import { VideoCall } from '../../../../domain/entities/videoCall/videoCallEntity';
import { WalletTransactionType } from '../../../../domain/enum/WalletTransactionType';

export class BookedSlotCancelUseCase implements IBookedSlotCancelUseCase {
  constructor(
    private _slotRepository: ISlotRepository,
    private _videoCallRepository: IVideoCallRepository,
    private _createNotification: CreateNotification,
    private _walletRepository: IWalletRepository,
    private _membershipRepository: IMembershipRepository,
    private _subscriptionRepository: ISubscriptionRepository
  ) {}

  async cancelBookedSlot(userId: string, slotId: string, reason: string, role: UserRole): Promise<void> {
    const session = await this._videoCallRepository.findById(slotId);

    // 2. Check existence
    if (!session) {
      throw new NotFoundException('Session not found for this slot');
    }
    console.log('session', session.status);

    // 3. Status Validation: Only 'WAITING' sessions can be cancelled
    if (session.status !== VideoCallStatus.WAITING) {
      throw new ConflictException(`Cannot cancel session with status: ${session.status}`);
    }

    // 4. Security Check: Role-based authorization using .toString() for ObjectIds
    if (role === UserRole.USER && session.userId.toString() !== userId) {
      throw new UnauthorizedException("You cannot cancel someone else's booking");
    }

    if (role === UserRole.TRAINER && session.trainerId.toString() !== userId) {
      throw new UnauthorizedException('You are not the assigned trainer for this session');
    }

    // 5. Business Rule: Ensure session hasn't started
    const now = new Date();
    if (new Date(session.startTime) < now) {
      throw new ConflictException('Cannot cancel a session that has already started or passed');
    }

    await this._videoCallRepository.update(session._id, {
      status: VideoCallStatus.CANCELLED,
      cancellationReason: reason.trim(),
      cancelledAt: new Date(),
      cancelledBy: role,
    });

    // 7. Re-open the slot
    await this._slotRepository.updateSlotStatus(session.slotId, {
      isBooked: false,
      bookedBy: null,
      slotStatus: SlotStatus.AVAILABLE,
    });

    // 8. Notify the other party
    const recipientId = role === UserRole.USER ? session.trainerId : session.userId;
    const recipientRole = role === UserRole.USER ? UserRole.TRAINER : UserRole.USER;
    const cancellerName = role === UserRole.USER ? 'The user' : 'The trainer';

    await this._createNotification.execute({
      recipientId: recipientId.toString(),
      recipientRole,
      type: NotificationType.SESSION_CANCELLED,
      title: 'Session Cancelled',
      message: `${cancellerName} has cancelled the session scheduled for ${new Date(session.startTime).toLocaleString()}.`,
      relatedId: session.slotId.toString(),
      isRead: false,
    });

    if(role === UserRole.TRAINER){
    await this.processRefund(session);
    } 
  }

  private async processRefund(session: VideoCall): Promise<void> {
    try {
      const membership = await this._membershipRepository.findByUserId(session.userId);
      if (!membership) return;

      const plan = await this._subscriptionRepository.findById(membership.planId.toString());
      if (!plan) return;

      const sessionRate = parseFloat((plan.price / (plan.durationMonths * 30)).toFixed(2));

      // ✅ Credit user wallet
      await this._walletRepository.credit(session.userId, 'user', sessionRate, {
        type: WalletTransactionType.REFUND,
        amount: sessionRate,
        description: `Refund for cancelled session scheduled at ${new Date(session.startTime).toLocaleString()}`,
        relatedId: session._id,
      });

      // ✅ Notify user about refund
      await this._createNotification.execute({
        recipientId: session.userId,
        recipientRole: UserRole.USER,
        type: NotificationType.REFUND,
        title: '💸 Refund Processed!',
        message: `₹${sessionRate} has been refunded to your wallet for the cancelled session.`,
        relatedId: session._id,
        isRead: false,
      });
    } catch (error) {
      console.error('❌ Error processing refund:', error);
    }
  }
}
