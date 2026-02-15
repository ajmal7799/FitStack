import { IBookedSlotsUseCase } from "../../../useCase/trainer/slot/IBookedSlotsUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { BookedSlotsTrainerDTO } from "../../../dto/slot/slotDTO";

export class BookedSlotsUseCase implements IBookedSlotsUseCase {
    constructor(
        private _slotRepository: ISlotRepository, 
        private _userRepository: IUserRepository
    ) {}

    async getBookedSlots(
        trainerId: string, 
        page: number, 
        limit: number
    ): Promise<{ slots: BookedSlotsTrainerDTO[]; totalSlots: number; totalePages: number; currentPage: number; }> {
        
        const skip = (page - 1) * limit;

        const [slots, totalSlots] = await Promise.all([
            this._slotRepository.findTrainerSessions(trainerId, skip, limit),
            this._slotRepository.countTrainerSessions(trainerId)
        ]);
        


        const mappedSlots: BookedSlotsTrainerDTO[] = await Promise.all(
            slots.map(async (slot) => {
                const trainee = await this._userRepository.findById(slot.bookedBy || '');
                
                return {
                    _id: slot._id,
                    userName: trainee?.name || "Unknown User",
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    slotStatus: slot.slotStatus,
                };
            })
        );

        // 3. Return the formatted paginated response
        return {
            slots: mappedSlots,
            totalSlots: totalSlots,
            totalePages: Math.ceil(totalSlots / limit) || 1,
            currentPage: page
        };
    }
}