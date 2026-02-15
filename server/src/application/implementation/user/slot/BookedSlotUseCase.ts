import { IBookedSlotUseCase } from "../../../useCase/user/booking/IBookedSlotUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { ITrainerSelectRepository } from "../../../../domain/interfaces/repositories/ITrainerSelectRepository";
import { TrainerRepository } from "../../../../infrastructure/repositories/trainerRepository";
import { NotFoundException,ConflictException } from "../../../constants/exceptions";
import { USER_ERRORS,TRAINER_ERRORS } from "../../../../shared/constants/error";
import { BookedSlotDTO } from "../../../dto/slot/slotDTO";

export class BookedSlotUseCase implements IBookedSlotUseCase {
    constructor( 
        private _userRepository: IUserRepository,
        private _slotRepository: ISlotRepository,
        private _trainerSelectRepository: ITrainerSelectRepository,
    ) {}

    async getBookedSlots(
        userId: string, 
        page: number, 
        limit: number
    ): Promise<{ slots: BookedSlotDTO[], totalSlots: number, totalePages: number, currentPage: number }> {
        
        const skip = (page - 1) * limit;

        // 1. Check for trainer selection
        const selectedTrainer = await this._trainerSelectRepository.findByUserId(userId);
        if (!selectedTrainer) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_SELECTED);
        }

        // 2. Fetch trainer details and slot data in parallel for efficiency
        const [trainer, slots, totalSlots] = await Promise.all([
            this._userRepository.findById(selectedTrainer.trainerId),
            this._slotRepository.findAllBookedSlotsByUserId(userId, skip, limit),
            this._slotRepository.countBookedSlotsByUserId(userId)
        ]);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }

        // 3. Map the retrieved slots (from the Promise.all result) to DTOs
        const bookedSlotsDTO = slots.map(slot => ({
            _id: slot._id,
            trainerName: trainer.name,
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotStatus: slot.slotStatus,
        }));

        // 4. Return the full pagination object
        return {
            slots: bookedSlotsDTO,
            totalSlots: totalSlots,
            totalePages: Math.ceil(totalSlots / limit) || 1,
            currentPage: page
        };
    }
}
