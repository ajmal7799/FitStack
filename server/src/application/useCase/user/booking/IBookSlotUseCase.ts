import { Slot } from '../../../../domain/entities/trainer/slot';
export interface IBookSlotUseCase {
    bookSlot(userId: string, slotId: string): Promise<Slot>;
}