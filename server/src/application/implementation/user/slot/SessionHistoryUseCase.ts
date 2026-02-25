import { ISessionHistoryUseCase } from "../../../useCase/user/booking/ISessionHistoryUseCase";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { SessionHistoryResult } from "../../../dto/slot/slotDTO";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ITrainerSelectRepository } from "../../../../domain/interfaces/repositories/ITrainerSelectRepository";
import { USER_ERRORS } from "../../../../shared/constants/error";
import { NotFoundException } from "../../../constants/exceptions";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";

export class SessionHistoryUseCase implements ISessionHistoryUseCase {
    constructor(
        private _videoCallRepository: IVideoCallRepository,
        private _userRepository: IUserRepository,
        private _trainerSelectRepository: ITrainerSelectRepository,
        private _feedbackRepository: IFeedbackRepository
    ) {}

    async getSessionHistory(
        userId: string,
        page: number,
        limit: number,
    ): Promise<{ sessions: SessionHistoryResult[]; totalSessions: number; totalPages: number; currentPage: number }> {
        const skip = (page - 1) * limit;

        const selectedTrainer = await this._trainerSelectRepository.findByUserId(userId);
        if (!selectedTrainer) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_SELECTED);
        }

        const [user, sessions, totalSessions] = await Promise.all([
            this._userRepository.findById(selectedTrainer.trainerId),
            this._videoCallRepository.findSessionsByUserId(userId, skip, limit),
            this._videoCallRepository.countSessionsByUserId(userId),
        ]);

        // ✅ All sessions from repo are completed — fetch feedback for all in parallel
        const feedbackResults = await Promise.all(
            sessions.map(session => this._feedbackRepository.findBySessionId(session._id))
        );

        // ✅ Build map: sessionId → rating for O(1) lookup
        const feedbackMap = new Map<string, number>();
        feedbackResults.forEach((feedback, index) => {
            if (feedback) {
                feedbackMap.set(sessions[index]._id, feedback.rating);
            }
        });

        const sessionHistoryResults: SessionHistoryResult[] = sessions.map(session => ({
            _id:           session._id,
            trainerName:   user?.name || "Unknown Trainer",
            startTime:     session.startTime,
            endTime:       session.endTime,
            sessionStatus: session.status as VideoCallStatus,
            // ✅ rating is the number if feedback submitted, undefined if not yet
            rating:        feedbackMap.get(session._id),
        }));

        const totalPages = Math.ceil(totalSessions / limit);

        return {
            sessions: sessionHistoryResults,
            totalSessions,
            totalPages,
            currentPage: page,
        };
    }
}