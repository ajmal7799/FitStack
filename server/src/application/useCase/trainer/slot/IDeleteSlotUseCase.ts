
export interface IDeleteSlotUseCase {
    deleteSlot(slotId: string, trainerId: string): Promise<void>;
}