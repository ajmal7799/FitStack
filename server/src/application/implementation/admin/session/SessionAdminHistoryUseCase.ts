import { ISessionAdminHistoryUseCase } from "../../../useCase/admin/session/ISessionAdminHistoryUseCase";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { SessionHistoryAdminDetailsResult } from "../../../dto/slot/slotDTO";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "../../../../domain/interfaces/services/IStorage/IStorageService";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";


export class SessionAdminHistoryUseCase implements ISessionAdminHistoryUseCase {
    constructor(
        private _videoCallRepository: IVideoCallRepository,
        private _userRepository: IUserRepository,
        private _storageService: IStorageService,
        private _feedbackRepository: IFeedbackRepository
    ) {}

    async getSessionHistoryDetails(sessionId: string): Promise<SessionHistoryAdminDetailsResult> {
        const session = await this._videoCallRepository.findById(sessionId);

        if (!session) {
            throw new Error("Session not found");
        }

        const [user, trainer] = await Promise.all([
            this._userRepository.findById(session.userId),
            this._userRepository.findById(session.trainerId)
        ]);

        if (!user || !trainer) {
            throw new Error("User or Trainer associated with this session no longer exists");
        }

        const [userImageUrl, trainerImageUrl] = await Promise.all([
            user.profileImage ? this._storageService.createSignedUrl(user.profileImage, 10 * 60) : Promise.resolve(""),
            trainer.profileImage ? this._storageService.createSignedUrl(trainer.profileImage, 10 * 60) : Promise.resolve("")
        ]);

        const feedback = await this._feedbackRepository.findBySessionId(sessionId);

        return {
            _id: session._id,
            userName: user.name,
            userEmail: user.email,
            userNumber: user.phone || "N/A",
            userProfileImage: userImageUrl || "", 
            trainerName: trainer.name,
            trainerEmail: trainer.email,
            trainerNumber: trainer.phone || "N/A",
            trainerProfileImage: trainerImageUrl || "",
            startTime: session.startTime,
            endTime: session.endTime,
            sessionStatus: session.status,
            cancellationReason: session.cancellationReason || null,
            cancelledAt: session.cancelledAt || null,
            // FIX 2: Convert Enum to String if necessary
            cancelledBy: session.cancelledBy || null,
            rating: feedback?.rating ?? undefined,
            review: feedback?.review ?? undefined,
            createdAt: feedback?.createdAt ?? undefined
        };
    }
}