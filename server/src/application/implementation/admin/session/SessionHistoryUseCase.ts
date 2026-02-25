import { SessionHistoryAdminResult } from "../../../dto/slot/slotDTO";
import { ISessionHistoryUseCase } from "../../../useCase/admin/session/ISessionHistoryUseCase";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";

// ── Internal type for populated session from repository ───────────────────────
interface PopulatedSession {
    _id: string;
    userName?: string;
    trainerName?: string;
    startTime: Date;
    endTime: Date;
    status: VideoCallStatus;
}

export class SessionHistoryUseCase implements ISessionHistoryUseCase {
    constructor(
        private _videoCallRepository: IVideoCallRepository,
        private _feedbackRepository: IFeedbackRepository
    ) {}

    async getSessionHistory(
        page: number,
        limit: number,
        status?: string,
        search?: string
    ): Promise<{ sessions: SessionHistoryAdminResult[]; totalSessions: number; totalPages: number; currentPage: number }> {

        const skip = (page - 1) * limit;

        const [sessions, totalSessions] = await Promise.all([
            this._videoCallRepository.findSessionsForAdmin(skip, limit, status, search) as Promise<PopulatedSession[]>,
            this._videoCallRepository.countSessionsForAdmin(status, search)
        ]);

        // ✅ Fetch feedback only for completed sessions in one parallel batch
        const completedSessions = sessions.filter(
            session => session.status === VideoCallStatus.COMPLETED
        );

        const feedbackMap = new Map<string, number>();

        if (completedSessions.length > 0) {
            const feedbackResults = await Promise.all(
                completedSessions.map(session =>
                    this._feedbackRepository.findBySessionId(session._id)
                )
            );

            feedbackResults.forEach((feedback, index) => {
                if (feedback) {
                    feedbackMap.set(completedSessions[index]._id, feedback.rating);
                }
            });
        }

        const mappedSessions: SessionHistoryAdminResult[] = sessions.map(session => ({
            _id:           session._id,
            userName:      session.userName    ?? "Unknown User",
            trainerName:   session.trainerName ?? "Unknown Trainer",
            startTime:     session.startTime,
            endTime:       session.endTime,
            sessionStatus: session.status,
            // ✅ Only populated for completed sessions that have feedback
            rating:        feedbackMap.get(session._id),
        }));

        return {
            sessions: mappedSessions,
            totalSessions,
            totalPages:  Math.ceil(totalSessions / limit),
            currentPage: page,
        };
    }
}