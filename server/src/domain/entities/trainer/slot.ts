
import { SlotStatus } from "../../enum/SlotEnums";
export interface Slot {
    _id: string;
    trainerId: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    bookedBy?: string | null; 
    slotStatus: SlotStatus;
    cancellationReason?: string | null;
    canceldAt?: Date | null;
}   