import { IBookedSlotDetailsUseCase } from "../../../useCase/user/booking/IBookedSlotDetailsUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { BookedSlotDetailsDTO } from "../../../dto/slot/slotDTO";
import { NotFoundException, UnauthorizedException } from "../../../constants/exceptions";
import { TRAINER_ERRORS, Errors } from "../../../../shared/constants/error";
import { IStorageService } from "../../../../domain/interfaces/services/IStorage/IStorageService";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";
import { IFeedbackRepository } from "../../../../domain/interfaces/repositories/IFeedbackRepository";

export class BookedSlotDetailsUseCase implements IBookedSlotDetailsUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _videoCallRepository: IVideoCallRepository,
        private _storageService: IStorageService,
        private _feedbackRepository: IFeedbackRepository
    ) {}

    async getBookedSlotDetails(userId: string, slotId: string): Promise<BookedSlotDetailsDTO> {
        const slot = await this._videoCallRepository.findById(slotId);

        if (!slot) {
            throw new NotFoundException(Errors.SLOT_NOT_FOUND);
        }

        if (slot.userId !== userId) {
            throw new UnauthorizedException("You do not have permission to view this slot.");
        }

        const trainer = await this._userRepository.findById(slot.trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        let profileImageUrl = trainer.profileImage || "";
        if (profileImageUrl) {
            profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
        }

        // ── Feedback logic ───────────────────────────────────────────────────
        let hasFeedback  = false;
        let feedbackData: {
            _id: string;
            rating: number;
            review?: string;
            createdAt?: Date;
        } | null = null;

        if (slot.status === VideoCallStatus.COMPLETED) {
            const existingFeedback = await this._feedbackRepository.findBySessionId(slotId);

            if (!existingFeedback) {
                // No feedback yet → user can submit
                hasFeedback = true;
            } else {
                // Feedback exists → pass it back so UI can show it
                feedbackData = {
                    _id:       existingFeedback._id,
                    rating:    existingFeedback.rating,
                    review:    existingFeedback.review,
                    createdAt: existingFeedback.createdAt,
                };
            }
        }

        return {
            _id:                slot._id,
            profileImage:       profileImageUrl,
            trainerName:        trainer.name,
            trainerEmail:       trainer.email,
            startTime:          slot.startTime,
            endTime:            slot.endTime,
            slotStatus:         slot.status,
            cancellationReason: slot.cancellationReason,
            cancelledAt:        slot.cancelledAt,
            cancelledBy:        slot.cancelledBy,
            hasFeedback,
            feedback:           feedbackData,
        };
    }
}