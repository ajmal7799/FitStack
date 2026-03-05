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
exports.SessionHistoryUseCase = void 0;
const error_1 = require("../../../../shared/constants/error");
const exceptions_1 = require("../../../constants/exceptions");
class SessionHistoryUseCase {
    constructor(_videoCallRepository, _userRepository, _trainerSelectRepository, _feedbackRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._trainerSelectRepository = _trainerSelectRepository;
        this._feedbackRepository = _feedbackRepository;
    }
    getSessionHistory(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const selectedTrainer = yield this._trainerSelectRepository.findByUserId(userId);
            if (!selectedTrainer) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_SELECTED);
            }
            const [user, sessions, totalSessions] = yield Promise.all([
                this._userRepository.findById(selectedTrainer.trainerId),
                this._videoCallRepository.findSessionsByUserId(userId, skip, limit),
                this._videoCallRepository.countSessionsByUserId(userId),
            ]);
            // ✅ All sessions from repo are completed — fetch feedback for all in parallel
            const feedbackResults = yield Promise.all(sessions.map(session => this._feedbackRepository.findBySessionId(session._id)));
            // ✅ Build map: sessionId → rating for O(1) lookup
            const feedbackMap = new Map();
            feedbackResults.forEach((feedback, index) => {
                if (feedback) {
                    feedbackMap.set(sessions[index]._id, feedback.rating);
                }
            });
            const sessionHistoryResults = sessions.map(session => ({
                _id: session._id,
                trainerName: (user === null || user === void 0 ? void 0 : user.name) || 'Unknown Trainer',
                startTime: session.startTime,
                endTime: session.endTime,
                sessionStatus: session.status,
                // ✅ rating is the number if feedback submitted, undefined if not yet
                rating: feedbackMap.get(session._id),
            }));
            const totalPages = Math.ceil(totalSessions / limit);
            return {
                sessions: sessionHistoryResults,
                totalSessions,
                totalPages,
                currentPage: page,
            };
        });
    }
}
exports.SessionHistoryUseCase = SessionHistoryUseCase;
