import { IBookedSlotDetailsUseCase } from "../../../useCase/trainer/slot/IBookedSlotDetailsUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { UpcomingSlotDetailsDTO } from "../../../dto/slot/slotDTO";
import { IStorageService } from "../../../../domain/interfaces/services/IStorage/IStorageService";
import { NotFoundException,UnauthorizedException } from "../../../constants/exceptions";
import { Errors, USER_ERRORS } from "../../../../shared/constants/error";


export class BookedSlotDetailsUseCase implements IBookedSlotDetailsUseCase {
    constructor(
        private _slotRepository: ISlotRepository,
        private _userRepository: IUserRepository,
        private _storageService: IStorageService
    ) {}

    async getBookedSlotDetails(trainerId: string, slotId: string): Promise<UpcomingSlotDetailsDTO> {
        const slot = await this._slotRepository.findById(slotId);
        if(!slot) {
            throw new NotFoundException(Errors.SLOT_NOT_FOUND);
        }
        if(slot.trainerId !== trainerId) {
             throw new UnauthorizedException("You do not have permission to view this slot.");
        }

        const user = await this._userRepository.findById(slot.bookedBy || '');
        if(!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        let profileImageUrl = user.profileImage || "";
        if (profileImageUrl) {
            profileImageUrl = await this._storageService.createSignedUrl(profileImageUrl, 10 * 60);
        }     

        return {
            _id: slot._id,
            profileImage: profileImageUrl,
            userName: user.name,
            userEmail: user.email,
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotStatus: slot.slotStatus,
            cancellationReason: slot.cancellationReason? slot.cancellationReason : "",
        };
        
    }
}