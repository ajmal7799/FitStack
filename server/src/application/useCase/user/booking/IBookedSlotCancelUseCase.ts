
export interface IBookedSlotCancelUseCase {
    cancelBookedSlot(userId: string, slotId: string, reason: string): Promise<void>;
}