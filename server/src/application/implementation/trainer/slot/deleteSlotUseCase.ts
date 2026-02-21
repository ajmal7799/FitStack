import { IDeleteSlotUseCase } from '../../../useCase/trainer/slot/IDeleteSlotUseCase';
import { ISlotRepository } from '../../../../domain/interfaces/repositories/ISlotRepository';
import { InvalidDataException, IsBlockedExecption, NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';

export class DeleteSlotUseCase implements IDeleteSlotUseCase {
    constructor(private _slotRepository: ISlotRepository) {}
    async deleteSlot(slotId: string, trainerId: string): Promise<void> {
        const slot = await this._slotRepository.findById(slotId);

        if (!slot) {
            throw new NotFoundException(TRAINER_ERRORS.SLOT_NOT_FOUND);
        }

        if (slot.trainerId.toString() !== trainerId) {
            throw new IsBlockedExecption(TRAINER_ERRORS.YOU_CAN_ONLY_DELETE_YOUR_OWN_SLOT);
        }

        // if (slot.isBooked) {
        //     throw new InvalidDataException(TRAINER_ERRORS.SLOT_ALREADY_BOOKED);
        // }

        await this._slotRepository.deleteById(slotId);
    }    
}