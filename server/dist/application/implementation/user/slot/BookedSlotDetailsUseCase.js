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
exports.BookedSlotDetailsUseCase = void 0;
const exceptions_1 = require("../../../constants/exceptions");
const error_1 = require("../../../../shared/constants/error");
const videoCallEnums_1 = require("../../../../domain/enum/videoCallEnums");
class BookedSlotDetailsUseCase {
    constructor(_userRepository, _videoCallRepository, _storageService, _feedbackRepository) {
        this._userRepository = _userRepository;
        this._videoCallRepository = _videoCallRepository;
        this._storageService = _storageService;
        this._feedbackRepository = _feedbackRepository;
    }
    getBookedSlotDetails(userId, slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slot = yield this._videoCallRepository.findById(slotId);
            if (!slot) {
                throw new exceptions_1.NotFoundException(error_1.Errors.SLOT_NOT_FOUND);
            }
            if (slot.userId !== userId) {
                throw new exceptions_1.UnauthorizedException('You do not have permission to view this slot.');
            }
            const trainer = yield this._userRepository.findById(slot.trainerId);
            if (!trainer) {
                throw new exceptions_1.NotFoundException(error_1.TRAINER_ERRORS.TRAINER_NOT_FOUND);
            }
            let profileImageUrl = trainer.profileImage || '';
            if (profileImageUrl) {
                profileImageUrl = yield this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
            }
            // ── Feedback logic ───────────────────────────────────────────────────
            let hasFeedback = false;
            let feedbackData = null;
            if (slot.status === videoCallEnums_1.VideoCallStatus.COMPLETED) {
                const existingFeedback = yield this._feedbackRepository.findBySessionId(slotId);
                if (!existingFeedback) {
                    // No feedback yet → user can submit
                    hasFeedback = true;
                }
                else {
                    // Feedback exists → pass it back so UI can show it
                    feedbackData = {
                        _id: existingFeedback._id,
                        rating: existingFeedback.rating,
                        review: existingFeedback.review,
                        createdAt: existingFeedback.createdAt,
                    };
                }
            }
            return {
                _id: slot._id,
                profileImage: profileImageUrl,
                trainerName: trainer.name,
                trainerEmail: trainer.email,
                startTime: slot.startTime,
                endTime: slot.endTime,
                slotStatus: slot.status,
                cancellationReason: slot.cancellationReason,
                cancelledAt: slot.cancelledAt,
                cancelledBy: slot.cancelledBy,
                hasFeedback,
                feedback: feedbackData,
            };
        });
    }
}
exports.BookedSlotDetailsUseCase = BookedSlotDetailsUseCase;
