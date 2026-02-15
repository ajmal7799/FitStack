import { BookedSlotDTO } from "../../../dto/slot/slotDTO";

export interface IBookedSlotUseCase {
    getBookedSlots(userId: string, page: number, limit: number): Promise<{slots: BookedSlotDTO[], totalSlots: number,totalePages: number, currentPage: number}>;
}