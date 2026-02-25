import { ISessionHistoryDetailsUseCase } from '../../../useCase/trainer/slot/ISessionHistoryDetails';
import { IVideoCallRepository } from '../../../../domain/interfaces/repositories/IVideoCallRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { SessionHistoryTrainerDetailsResult } from '../../../dto/slot/slotDTO';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';
import { IFeedbackRepository } from '../../../../domain/interfaces/repositories/IFeedbackRepository';

export class SessionHistoryDetailsUseCase implements ISessionHistoryDetailsUseCase {
  constructor(
    private _videoCallRepository: IVideoCallRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    private _feedbackRepository: IFeedbackRepository
  ) {}

  async getTrainerSessionHistoryDetails(
    trainerId: string,
    sessionId: string
  ): Promise<SessionHistoryTrainerDetailsResult> {
    const session = await this._videoCallRepository.findById(sessionId);

    if (!session || session.trainerId !== trainerId) {
      throw new Error('Session not found or access denied');
    }

    const user = await this._userRepository.findById(session.userId);
    if (!user) throw new Error('User not found');

    let profileImageUrl = user.profileImage || '';
    if (profileImageUrl) {
      profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
    }
    const feedback = await this._feedbackRepository.findBySessionId(sessionId);

    return {
      _id: session._id,
      userName: user?.name || 'Unknown User',
      userEmail: user?.email || 'Unknown Email',
      profileImage: profileImageUrl,
      startTime: session.startTime,
      endTime: session.endTime,
      sessionStatus: session.status,
      cancellationReason: session.cancellationReason || null,
      cancelledAt: session.cancelledAt || null,
      cancelledBy: session.cancelledBy || null,
      rating: feedback?.rating ?? undefined,
      review: feedback?.review ?? undefined,
      createdAt: feedback?.createdAt ?? undefined,
    };
  }
}
