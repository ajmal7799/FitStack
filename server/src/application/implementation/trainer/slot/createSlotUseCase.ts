import { CreateSlotDTO } from '../../../dto/trainer/slot/createSlotDTO';
import { ICreateSlotUseCase } from '../../../useCase/trainer/slot/ICreateSlotUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { AlreadyExisitingExecption, NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';
import { SlotMapper } from '../../../mappers/slotMappers';
import { SlotStatus } from '../../../../domain/enum/SlotEnums';

export class CreateSlotUseCase implements ICreateSlotUseCase {
    constructor(
    private _userRepository: IUserRepository,
    private _slotRepository: ISlotRepository,

    ) {}

    async createSlot(trainerId: string, startTime: string): Promise<CreateSlotDTO> {
        const trainer = await this._userRepository.findById(trainerId);

        if (!trainer) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_NOT_FOUND);
        }
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
       
        const isOverLapping = await this._slotRepository.isOverLapping(trainerId, start.toISOString(), end.toISOString());

        if (isOverLapping) {
            throw new AlreadyExisitingExecption(TRAINER_ERRORS.SLOT_ALREADY_EXISTS_IN_THAT_TIME);
        }
        const data: CreateSlotDTO = {
            _id: '',
            trainerId: trainerId,
            startTime: start,
            endTime: end,
            isBooked: false,
            bookedBy: null,
            slotStatus: SlotStatus.AVAILABLE,
        }; 

        const slotData = SlotMapper.toEntity(data);
        const slot = await this._slotRepository.save(slotData);
        return slot;
       
    }
}