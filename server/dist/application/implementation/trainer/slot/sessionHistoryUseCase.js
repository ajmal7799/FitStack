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
class SessionHistoryUseCase {
    constructor(_videoCallRepository, _userRepository, _feedbackRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._userRepository = _userRepository;
        this._feedbackRepository = _feedbackRepository;
    }
    getTrainerSessionHistory(trainerId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [sessions, totalSessions] = yield Promise.all([
                this._videoCallRepository.findSessionsByTrainerId(trainerId, skip, limit, search),
                this._videoCallRepository.countSessionsByTrainerId(trainerId, search),
            ]);
            const sessionHistoryResults = yield Promise.all(sessions.map((session) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this._userRepository.findById(session.userId);
                const feedback = yield this._feedbackRepository.findBySessionId(session._id);
                return {
                    _id: session._id,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || 'Unknown User',
                    startTime: session.startTime,
                    endTime: session.endTime,
                    sessionStatus: session.status,
                    rating: (feedback === null || feedback === void 0 ? void 0 : feedback.rating) || 0,
                };
            })));
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
