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
exports.CreateFeedback = void 0;
const exceptions_1 = require("../../constants/exceptions");
const error_1 = require("../../../shared/constants/error");
const videoCallEnums_1 = require("../../../domain/enum/videoCallEnums");
const feedbackMappers_1 = require("../../mappers/feedbackMappers");
const userEnums_1 = require("../../../domain/enum/userEnums");
const NotificationEnums_1 = require("../../../domain/enum/NotificationEnums");
class CreateFeedback {
    constructor(_feedbackRepository, _videoCallRepository, _TrainerRepository, _createNotification, _userRepository) {
        this._feedbackRepository = _feedbackRepository;
        this._videoCallRepository = _videoCallRepository;
        this._TrainerRepository = _TrainerRepository;
        this._createNotification = _createNotification;
        this._userRepository = _userRepository;
    }
    createFeedback(userId, sessionId, rating, review) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const videoCall = yield this._videoCallRepository.findById(sessionId);
            if (!videoCall)
                throw new exceptions_1.NotFoundException(error_1.Errors.VIDEO_CALL_NOT_FOUND);
            if (videoCall.status !== videoCallEnums_1.VideoCallStatus.COMPLETED)
                throw new exceptions_1.NotFoundException(error_1.Errors.VIDEO_CALL_NOT_COMPLETED);
            if (videoCall.userId !== userId)
                throw new exceptions_1.NotFoundException(error_1.Errors.NOT_ALLOWED);
            const trainerId = videoCall.trainerId.toString();
            const trainer = yield this._TrainerRepository.findByTrainerId(trainerId);
            if (!trainer)
                throw new exceptions_1.NotFoundException(error_1.Errors.TRAINER_NOT_FOUND);
            const existing = yield this._feedbackRepository.findBySessionId(videoCall._id.toString());
            if (existing) {
                throw new exceptions_1.NotFoundException(error_1.Errors.FEEDBACK_ALREADY_EXISTS);
            }
            const feedbackToEntity = {
                _id: '',
                sessionId: videoCall._id.toString(),
                userId,
                trainerId,
                rating,
                review: review !== null && review !== void 0 ? review : '',
            };
            const feedbackData = feedbackMappers_1.FeedbackMapper.toEntity(feedbackToEntity);
            const feedback = yield this._feedbackRepository.save(feedbackData);
            const currentSum = (_a = trainer.ratingSum) !== null && _a !== void 0 ? _a : 0;
            const currentCount = (_b = trainer.ratingCount) !== null && _b !== void 0 ? _b : 0;
            const newRatingSum = currentSum + rating;
            const newRatingCount = currentCount + 1;
            const newAverageRating = Number((newRatingSum / newRatingCount).toFixed(2));
            // 4. Update Trainer with pre-calculated values
            yield this._TrainerRepository.updateRatingMetrics(trainer.id, {
                ratingSum: newRatingSum,
                ratingCount: newRatingCount,
                averageRating: newAverageRating,
            });
            const user = yield this._userRepository.findById(userId);
            if (!user)
                throw new exceptions_1.NotFoundException(error_1.Errors.USER_NOT_FOUND);
            yield this._createNotification.execute({
                recipientId: trainerId,
                recipientRole: userEnums_1.UserRole.TRAINER,
                type: NotificationEnums_1.NotificationType.FEEDBACK_RECEIVED,
                title: "Feedback Received",
                message: `${user.name} has given you a feedback.`,
                isRead: false
            });
            return feedback;
        });
    }
}
exports.CreateFeedback = CreateFeedback;
