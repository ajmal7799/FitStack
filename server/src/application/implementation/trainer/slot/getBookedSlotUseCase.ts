import { IBookedSlotsUseCase } from "../../../useCase/trainer/slot/IBookedSlotsUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { ISlotRepository } from "../../../../domain/interfaces/repositories/ISlotRepository";
import { BookedSlotsTrainerDTO } from "../../../dto/slot/slotDTO";
import { IVideoCallRepository } from "../../../../domain/interfaces/repositories/IVideoCallRepository";
import { VideoCallStatus } from "../../../../domain/enum/videoCallEnums";

export class BookedSlotsUseCase implements IBookedSlotsUseCase {
    constructor(
        private _videoCallRepository: IVideoCallRepository,
        private _userRepository: IUserRepository
    ) {}

    async getBookedSlots(
        trainerId: string, 
        page: number, 
        limit: number,
        status?: string
    ): Promise<{ slots: BookedSlotsTrainerDTO[]; totalSlots: number; totalePages: number; currentPage: number; }> {
        
        const skip = (page - 1) * limit;

        const [slots, totalSlots] = await Promise.all([
            this._videoCallRepository.findAllBookedSessionByTrainerId(trainerId, skip, limit, status as VideoCallStatus),
            this._videoCallRepository.countBookedSessionByTrainerId(trainerId, status as VideoCallStatus),
        ]);
        


        const mappedSlots: BookedSlotsTrainerDTO[] = await Promise.all(
            slots.map(async (slot) => {
                const trainee = await this._userRepository.findById(slot.userId || '');
                
                return {
                    _id: slot._id,
                    userName: trainee?.name || "Unknown User",
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    slotStatus: slot.status,
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