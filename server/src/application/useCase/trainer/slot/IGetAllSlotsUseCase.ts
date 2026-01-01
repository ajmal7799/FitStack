import { Slot } from "../../../../domain/entities/trainer/slot";
export interface IGetAllSlotsUseCase {
    getAllSlots(trainerId: string, page: number, limit: number, status?: string): Promise<{ slots: Slot[]; totalSlots: number; totalPages: number; currentPage: number }>;
}