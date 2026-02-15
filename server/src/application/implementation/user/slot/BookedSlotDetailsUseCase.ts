import { IBookedSlotDetailsUseCase } from "../../../useCase/user/booking/IBookedSlotDetailsUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { BookedSlotDetailsDTO } from "../../../dto/slot/slotDTO";
import { NotFoundException, UnauthorizedException } from "../../../constants/exceptions";
import { TRAINER_ERRORS, Errors } from "../../../../shared/constants/error";
import { IStorageService } from "../../../../domain/interfaces/services/IStorage/IStorageService";

export class BookedSlotDetailsUseCase implements IBookedSlotDetailsUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _slotRepository: ISlotRepository,
        private _storageService: IStorageService // Added to handle signed URLs
    ) {}

    async getBookedSlotDetails(userId: string, slotId: string): Promise<BookedSlotDetailsDTO> {
        // 1. Fetch the slot
        const slot = await this._slotRepository.findById(slotId);

        if (!slot) {
            throw new NotFoundException(Errors.SLOT_NOT_FOUND);
        }

        // 2. Security Check: Ensure this slot belongs to the user requesting it
        if (slot.bookedBy !== userId) {
            throw new UnauthorizedException("You do not have permission to view this slot.");
        }

        // 3. Fetch Trainer details (the owner of the slot)
        const trainer = await this._userRepository.findById(slot.trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        // 4. Handle Signed URL for profile image
        let profileImageUrl = trainer.profileImage || "";
        if (profileImageUrl) {
            profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
        }

        // 5. Map to DTO
        return {
            _id: slot._id,
            profileImage: profileImageUrl,
            trainerName: trainer.name,
            trainerEmail: trainer.email,
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotStatus: slot.slotStatus, // Assuming slot has a status field
        };
    }
}