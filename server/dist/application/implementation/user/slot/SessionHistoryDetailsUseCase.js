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
exports.SessionHistoryDetailsUseCase = void 0;
class SessionHistoryDetailsUseCase {
    constructor(_videoCallRepository, _userRepository, _storageService, _feedbackRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._feedbackRepository = _feedbackRepository;
    }
    getSessionHistoryDetails(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const session = yield this._videoCallRepository.findById(sessionId);
            if (!session || session.userId !== userId) {
                throw new Error('Session not found or access denied');
            }
            const trainer = yield this._userRepository.findById(session.trainerId);
            if (!trainer)
                throw new Error('Trainer not found');
            let profileImageUrl = trainer.profileImage || '';
            if (profileImageUrl) {
                profileImageUrl = yield this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
            }
            const feedback = yield this._feedbackRepository.findBySessionId(sessionId);
            return {
                _id: session._id,
                trainerName: trainer.name,
                trainerEmail: trainer.email,
                profileImage: profileImageUrl,
                startTime: session.startTime,
                endTime: session.endTime,
                sessionStatus: session.status,
                cancellationReason: session.cancellationReason || null,
                cancelledAt: session.cancelledAt || null,
                cancelledBy: session.cancelledBy || null,
                rating: (_a = feedback === null || feedback === void 0 ? void 0 : feedback.rating) !== null && _a !== void 0 ? _a : undefined,
                review: (_b = feedback === null || feedback === void 0 ? void 0 : feedback.review) !== null && _b !== void 0 ? _b : undefined,
                createdAt: (_c = feedback === null || feedback === void 0 ? void 0 : feedback.createdAt) !== null && _c !== void 0 ? _c : undefined,
            };
        });
    }
}
exports.SessionHistoryDetailsUseCase = SessionHistoryDetailsUseCase;
