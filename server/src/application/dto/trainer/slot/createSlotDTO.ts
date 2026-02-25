import { SlotStatus } from "../../../../domain/enum/SlotEnums";

export interface CreateSlotDTO {
    _id: string;
    trainerId: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    bookedBy?: string | null;
    slotStatus: SlotStatus;
   
}