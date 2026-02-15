import { IGetAllSlotsUseCase } from '../../../useCase/trainer/slot/IGetAllSlotsUseCase';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { Slot } from '../../../../domain/entities/trainer/slot';
import { NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';

export class GetAllSlotsUseCase implements IGetAllSlotsUseCase {
    constructor(private _userRepository: IUserRepository, private _slotRepository: ISlotRepository) {}

    async getAllSlots(
        trainerId: string,
        page: number,
        limit: number,
        status?: string,
    ): Promise<{ slots: Slot[]; totalSlots: number; totalPages: number; currentPage: number }> {
        const trainer = await this._userRepository.findById(trainerId);
        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }
        const skip = (page - 1) * limit;
        const [slots, totalSlots] = await Promise.all([
            this._slotRepository.findAllSlots(trainerId, skip, limit, status),
            this._slotRepository.countSlots(trainerId, status),
        ]);
        return {
            slots,
            totalSlots,
            totalPages: Math.ceil(totalSlots / limit),
            currentPage: page,
        };
    }
}
