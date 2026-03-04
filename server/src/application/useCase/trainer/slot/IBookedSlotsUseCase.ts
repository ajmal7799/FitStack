import { BookedSlotsTrainerDTO } from '../../../dto/slot/slotDTO';
export interface IBookedSlotsUseCase {
    getBookedSlots(userId: string, page: number, limit: number, status?: string, search?: string): Promise<{slots: BookedSlotsTrainerDTO[], totalSlots: number,totalePages: number, currentPage: number}>;
}