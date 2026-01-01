
import { Slot } from "../../../../domain/entities/trainer/slot"
export interface IGetAllAvailableSlotUseCase {
    getAvailableSlots(userId: string, date: string): Promise<Slot[]>
}