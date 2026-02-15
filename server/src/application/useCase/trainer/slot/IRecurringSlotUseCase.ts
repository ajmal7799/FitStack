import { RecurringSlotDTO } from '../../../dto/trainer/slot/recurringDTO';
import { Slot } from '../../../../domain/entities/trainer/slot';

export interface IRecurringSlotUseCase {
  createRecurringSlot(trainerId: string, data: RecurringSlotDTO): Promise<Slot[]>;
}
