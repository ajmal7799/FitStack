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
const videoCallEnums_1 = require("../../../../domain/enum/videoCallEnums");
class SessionHistoryUseCase {
    constructor(_videoCallRepository, _feedbackRepository) {
        this._videoCallRepository = _videoCallRepository;
        this._feedbackRepository = _feedbackRepository;
    }
    getSessionHistory(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [sessions, totalSessions] = yield Promise.all([
                this._videoCallRepository.findSessionsForAdmin(skip, limit, status, search),
                this._videoCallRepository.countSessionsForAdmin(status, search)
            ]);
            // ✅ Fetch feedback only for completed sessions in one parallel batch
            const completedSessions = sessions.filter(session => session.status === videoCallEnums_1.VideoCallStatus.COMPLETED);
            const feedbackMap = new Map();
            if (completedSessions.length > 0) {
                const feedbackResults = yield Promise.all(completedSessions.map(session => this._feedbackRepository.findBySessionId(session._id)));
                feedbackResults.forEach((feedback, index) => {
                    if (feedback) {
                        feedbackMap.set(completedSessions[index]._id, feedback.rating);
                    }
                });
            }
            const mappedSessions = sessions.map(session => {
                var _a, _b;
                return ({
                    _id: session._id,
                    userName: (_a = session.userName) !== null && _a !== void 0 ? _a : "Unknown User",
                    trainerName: (_b = session.trainerName) !== null && _b !== void 0 ? _b : "Unknown Trainer",
                    startTime: session.startTime,
                    endTime: session.endTime,
                    sessionStatus: session.status,
                    // ✅ Only populated for completed sessions that have feedback
                    rating: feedbackMap.get(session._id),
                });
            });
            return {
                sessions: mappedSessions,
                totalSessions,
                totalPages: Math.ceil(totalSessions / limit),
                currentPage: page,
            };
        });
    }
}
exports.SessionHistoryUseCase = SessionHistoryUseCase;
