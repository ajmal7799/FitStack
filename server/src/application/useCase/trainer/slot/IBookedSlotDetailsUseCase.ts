import { UpcomingSlotDetailsDTO } from "../../../dto/slot/slotDTO";
export interface IBookedSlotDetailsUseCase {
    getBookedSlotDetails(trainerId: string, slotId: string): Promise<UpcomingSlotDetailsDTO>;
}