import { BookedSlotDetailsDTO } from "../../../dto/slot/slotDTO";

export interface IBookedSlotDetailsUseCase {
  getBookedSlotDetails(userId: string, slotId: string): Promise<BookedSlotDetailsDTO>;
}