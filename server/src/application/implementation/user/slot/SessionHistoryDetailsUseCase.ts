import { ISessionHistoryDetailsUseCase } from "../../../useCase/user/booking/ISessionHistoryDetailsUseCase";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { SessionHistoryDetailsResult } from "../../../dto/slot/slotDTO";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "../../../../domain/interfaces/services/IStorage/IStorageService";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";


export class SessionHistoryDetailsUseCase implements ISessionHistoryDetailsUseCase {
    constructor(private _videoCallRepository: IVideoCallRepository, private _userRepository: IUserRepository, private _storageService: IStorageService, private _feedbackRepository: IFeedbackRepository) {}

    async getSessionHistoryDetails(userId: string, sessionId: string): Promise<SessionHistoryDetailsResult> {
        
        const session = await this._videoCallRepository.findById(sessionId);

        if (!session || session.userId !== userId) {
            throw new Error("Session not found or access denied");
        }

        const trainer = await this._userRepository.findById(session.trainerId);
        if (!trainer)  throw new Error("Trainer not found");

        let profileImageUrl = trainer.profileImage || "";
        if (profileImageUrl) {
            profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
        }

        const feedback = await this._feedbackRepository.findBySessionId(sessionId);
        



        return {
            _id: session._id,
            trainerName: trainer.name,
            trainerEmail: trainer.email,
            profileImage: profileImageUrl,
            startTime: session.startTime,
            endTime: session.endTime,
            sessionStatus: session.status as VideoCallStatus,
            cancellationReason: session.cancellationReason || null,
            cancelledAt: session.cancelledAt || null,
            cancelledBy: session.cancelledBy || null,
            rating:    feedback?.rating    ?? undefined,
    review:    feedback?.review    ?? undefined,
    createdAt: feedback?.createdAt ?? undefined,
        };
    }
}