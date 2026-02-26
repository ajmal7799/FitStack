import { IEndVideoCallSessionUseCase } from '../../useCase/video/IEndVideoCallSessionUseCase';
import { IVideoCallRepository } from '../../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { ISlotRepository } from '../../../domain/interfaces/repositories/ISlotRepository';
import { SlotStatus } from '../../../domain/enum/SlotEnums';
import { NotFoundException, AlreadyExisitingExecption } from '../../constants/exceptions';
import { VideoCall } from '../../../domain/entities/videoCall/videoCallEntity';
import { IWalletRepository } from '../../../domain/interfaces/repositories/IWalletRepository';
import { IMembershipRepository } from '../../../domain/interfaces/repositories/IMembershipRepository';
import { ISubscriptionRepository } from '../../../domain/interfaces/repositories/ISubscriptionRepository';
import { CreateNotification } from '../notification/CreateNotification';
import { WalletTransactionType } from '../../../domain/enum/WalletTransactionType';
import { UserRole } from '../../../domain/enum/userEnums';
import { NotificationType } from '../../../domain/enum/NotificationEnums';

const PLATFORM_FEE_PERCENT = 0.2;
const TRAINER_COMMISSION_PERCENT = 0.8;
const ADMIN_ID = 'platform_admin'; // fixed admin wallet owner

export class EndVideoCallSessionUseCase implements IEndVideoCallSessionUseCase {
  constructor(
    private _videoCallRepository: IVideoCallRepository,
    private _slotRepository: ISlotRepository,
    private _walletRepository: IWalletRepository,
    private _membershipRepository: IMembershipRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _createNotification: CreateNotification
  ) {}
  async execute(slotId: string): Promise<{ sessionId: string }> {
    const session = await this._videoCallRepository.findById(slotId);

    if (!session) throw new NotFoundException('Session not found');

    if (session.status == VideoCallStatus.COMPLETED || session.status == VideoCallStatus.MISSED) {
      throw new AlreadyExisitingExecption('Session already ended');
    }

    const now = new Date();

    let newStatus: VideoCallStatus;
    if (session.startedAt) {
      newStatus = VideoCallStatus.COMPLETED;
    } else {
      newStatus = VideoCallStatus.MISSED;
    }

    const updateDatas = {
      status: newStatus,
      endedAt: now,
      trainerJoined: false,
      userJoined: false,
    };

    await this._videoCallRepository.update(session._id, updateDatas);
    await this._slotRepository.updateSlotStatus(
      session.slotId,
      newStatus === VideoCallStatus.COMPLETED ? { slotStatus: SlotStatus.COMPLETED } : { slotStatus: SlotStatus.MISSED }
    );

    if (newStatus === VideoCallStatus.COMPLETED) {
      await this.processPayout(session);
    }

    return { sessionId: session._id };
  }

  private async processPayout(session: VideoCall): Promise<void> {
    try {
      const membership = await this._membershipRepository.findByUserId(session.userId);

      if (!membership) {
        return;
      }

      const plan = await this._subscriptionRepository.findById(membership.planId.toString());

      if (!plan) {
        return;
      }

      const sessionRate = parseFloat((plan.price / (plan.durationMonths * 30)).toFixed(2));
      const trainerAmount = parseFloat((sessionRate * TRAINER_COMMISSION_PERCENT).toFixed(2));
      const platformAmount = parseFloat((sessionRate * PLATFORM_FEE_PERCENT).toFixed(2));

      await this._walletRepository.credit(session.trainerId, 'trainer', trainerAmount, {
        type: WalletTransactionType.SESSION_COMMISSION,
        amount: trainerAmount,
        description: `Session commission (80%) for completed session`,
        relatedId: session._id,
      });

      await this._walletRepository.credit(ADMIN_ID, 'admin', platformAmount, {
        type: WalletTransactionType.PLATFORM_FEE,
        amount: platformAmount,
        description: `Platform fee (20%) for completed session`,
        relatedId: session._id,
      });

      await this._createNotification.execute({
        recipientId: session.trainerId,
        recipientRole: UserRole.TRAINER,
        type: NotificationType.SESSION_COMMISSION,
        title: '💰 Session Payment Received!',
        message: `₹${trainerAmount} has been credited to your wallet for completing a session.`,
        relatedId: session._id,
        isRead: false,
      });
    } catch (error) {
      console.error('Error processing session payout:', error);
    }
  }
}
