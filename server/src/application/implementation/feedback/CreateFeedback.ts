import { ICreateFeedback } from '../../useCase/feedback/ICreateFeedback';
import { IFeedbackRepository } from '../../../domain/interfaces/repositories/IFeedbackRepository';
import { Feedback } from '../../../domain/entities/Feedback/feedbackEntity';
import { IVideoCallRepository } from '../../../domain/interfaces/repositories/IVideoCallRepository';
import { NotFoundException } from '../../constants/exceptions';
import { Errors } from '../../../shared/constants/error';
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { CreateFeedbackDto } from '../../dto/feedback/createFeedback';
import { FeedbackMapper } from '../../mappers/feedbackMappers';
import { ITrainerRepository } from '../../../domain/interfaces/repositories/ITrainerRepository';
import { CreateNotification } from '../notification/CreateNotification';
import { UserRole } from '../../../domain/enum/userEnums';
import { NotificationType } from '../../../domain/enum/NotificationEnums';

export class CreateFeedback implements ICreateFeedback {
  constructor(
    private _feedbackRepository: IFeedbackRepository,
    private _videoCallRepository: IVideoCallRepository,
    private _TrainerRepository: ITrainerRepository,
    private _createNotification: CreateNotification
  ) {}

  async createFeedback(userId: string, sessionId: string, rating: number, review: string): Promise<CreateFeedbackDto> {
    const videoCall = await this._videoCallRepository.findById(sessionId);
    if (!videoCall) throw new NotFoundException(Errors.VIDEO_CALL_NOT_FOUND);
    if (videoCall.status !== VideoCallStatus.COMPLETED) throw new NotFoundException(Errors.VIDEO_CALL_NOT_COMPLETED);
    if (videoCall.userId !== userId) throw new NotFoundException(Errors.NOT_ALLOWED);


    const trainerId = videoCall.trainerId.toString();
    const trainer = await this._TrainerRepository.findByTrainerId(trainerId);
    if (!trainer) throw new NotFoundException(Errors.TRAINER_NOT_FOUND);


    const existing = await this._feedbackRepository.findBySessionId(videoCall._id.toString());

    if (existing) {
      throw new NotFoundException(Errors.FEEDBACK_ALREADY_EXISTS);
    }

    const feedbackToEntity: CreateFeedbackDto = {
      _id: '',
      sessionId: videoCall._id.toString(),
      userId,
      trainerId,
      rating,
      review: review ?? '',
    };

    const feedbackData = FeedbackMapper.toEntity(feedbackToEntity);
    const feedback = await this._feedbackRepository.save(feedbackData);

    const currentSum = trainer.ratingSum ?? 0;
    const currentCount = trainer.ratingCount ?? 0;

    const newRatingSum = currentSum + rating;
    const newRatingCount = currentCount + 1;
    const newAverageRating = Number((newRatingSum / newRatingCount).toFixed(2));

    // 4. Update Trainer with pre-calculated values
    await this._TrainerRepository.updateRatingMetrics(trainer.id, {
      ratingSum: newRatingSum,
      ratingCount: newRatingCount,
      averageRating: newAverageRating,
    });

    await this._createNotification.execute({
      recipientId: trainerId,
      recipientRole: UserRole.TRAINER,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: "Feedback Received",
      message: `${userId} has given you a feedback.`,
      isRead: false
    })

    return feedback;
  }
}
