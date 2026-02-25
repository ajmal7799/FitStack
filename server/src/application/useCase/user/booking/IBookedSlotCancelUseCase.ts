import { UserRole } from "../../../../domain/enum/userEnums";
export interface IBookedSlotCancelUseCase {
    cancelBookedSlot(userId: string, slotId: string, reason: string, role: UserRole): Promise<void>;
}