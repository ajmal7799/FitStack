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
exports.SessionAdminHistoryUseCase = void 0;
class SessionAdminHistoryUseCase {
    constructor(_videoCallRepository, _userRepository, _storageService, _feedbackRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._storageService = _storageService;
        this._feedbackRepository = _feedbackRepository;
    }
    getSessionHistoryDetails(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const session = yield this._videoCallRepository.findById(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }
            const [user, trainer] = yield Promise.all([
                this._userRepository.findById(session.userId),
                this._userRepository.findById(session.trainerId),
            ]);
            if (!user || !trainer) {
                throw new Error('User or Trainer associated with this session no longer exists');
            }
            const [userImageUrl, trainerImageUrl] = yield Promise.all([
                user.profileImage ? this._storageService.createSignedUrl(user.profileImage, 10 * 60) : Promise.resolve(''),
                trainer.profileImage ? this._storageService.createSignedUrl(trainer.profileImage, 10 * 60) : Promise.resolve(''),
            ]);
            const feedback = yield this._feedbackRepository.findBySessionId(sessionId);
            return {
                _id: session._id,
                userName: user.name,
                userEmail: user.email,
                userNumber: user.phone || 'N/A',
                userProfileImage: userImageUrl || '',
                trainerName: trainer.name,
                trainerEmail: trainer.email,
                trainerNumber: trainer.phone || 'N/A',
                trainerProfileImage: trainerImageUrl || '',
                startTime: session.startTime,
                endTime: session.endTime,
                sessionStatus: session.status,
                cancellationReason: session.cancellationReason || null,
                cancelledAt: session.cancelledAt || null,
                // FIX 2: Convert Enum to String if necessary
                cancelledBy: session.cancelledBy || null,
                rating: (_a = feedback === null || feedback === void 0 ? void 0 : feedback.rating) !== null && _a !== void 0 ? _a : undefined,
                review: (_b = feedback === null || feedback === void 0 ? void 0 : feedback.review) !== null && _b !== void 0 ? _b : undefined,
                createdAt: (_c = feedback === null || feedback === void 0 ? void 0 : feedback.createdAt) !== null && _c !== void 0 ? _c : undefined,
            };
        });
    }
}
exports.SessionAdminHistoryUseCase = SessionAdminHistoryUseCase;
