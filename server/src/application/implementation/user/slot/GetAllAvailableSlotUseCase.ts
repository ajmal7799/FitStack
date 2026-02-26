import { IGetAllAvailableSlotUseCase } from '../../../useCase/user/booking/IGetAllAvailableSlotUseCase';
import { Slot } from '../../../../domain/entities/trainer/slot';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ITrainerSelectRepository } from '../../../../domain/interfaces/repositories/ITrainerSelectRepository';
import { NotFoundException } from '../../../constants/exceptions';
import { USER_ERRORS } from '../../../../shared/constants/error';

export class GetAllAvailableSlotUseCase implements IGetAllAvailableSlotUseCase {
    constructor(
        private _slotRepository: ISlotRepository,
        private _userRepository: IUserRepository,
        private _trainerSelectRepository: ITrainerSelectRepository,
    ) {}

    async getAvailableSlots(userId: string, date: string): Promise<Slot[]> {
        const user = await this._userRepository.findById(userId);
        
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        const trainerSelect = await this._trainerSelectRepository.findByUserId(userId);

        if (!trainerSelect) {
            throw new NotFoundException(USER_ERRORS.TRAINER_SELECT_NOT_FOUND);
        }
        const trainerId = trainerSelect.trainerId;
        console.log('trainerId', trainerId, 'date', date);

        return await this._slotRepository.findAllAvailableSlots(trainerId, date);
    }
}