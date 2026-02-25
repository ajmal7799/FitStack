import { ISessionHistoryUseCase } from "../../../useCase/trainer/slot/ISessionHistoryUseCase";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { SessionHistoryTrainerResult } from "../../../dto/slot/slotDTO";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";


export class SessionHistoryUseCase implements ISessionHistoryUseCase {
    constructor(private _videoCallRepository: IVideoCallRepository, private _userRepository: IUserRepository, private _feedbackRepository: IFeedbackRepository) {}

   async getTrainerSessionHistory(trainerId: string, page: number, limit: number): Promise<{ sessions: SessionHistoryTrainerResult[]; totalSessions: number; totalPages: number; currentPage: number; }> {
        const skip = (page - 1) * limit;

        const [ sessions, totalSessions] = await Promise.all([
            this._videoCallRepository.findSessionsByTrainerId(trainerId, skip, limit),
            this._videoCallRepository.countSessionsByTrainerId(trainerId)
        ]);

       const sessionHistoryResults: SessionHistoryTrainerResult[] = await Promise.all(
        sessions.map(async (session) => {
            const user = await this._userRepository.findById(session.userId);
            const feedback = await this._feedbackRepository.findBySessionId(session._id);
            return {
                _id: session._id,
                userName: user?.name || "Unknown User",
                startTime: session.startTime,
                endTime: session.endTime,
                sessionStatus: session.status as VideoCallStatus,
                rating: feedback?.rating || 0
            };
        })
       )
        const totalPages = Math.ceil(totalSessions / limit);
        return {
            sessions: sessionHistoryResults,
            totalSessions,
            totalPages,
            currentPage: page
        };
    }
}