import { SlotStatus } from "../../../domain/enum/SlotEnums";
export interface BookedSlotDTO {
    _id: string;
    trainerName: string;
    startTime: Date;
    endTime: Date;
    slotStatus: SlotStatus;
}


export interface BookedSlotDetailsDTO {
    _id: string;
    profileImage: string;
    trainerName: string;
    trainerEmail: string;
    startTime: Date;
    endTime: Date;
    slotStatus: SlotStatus;
}


export interface BookedSlotsTrainerDTO {
    _id: string;
    userName: string;
    startTime: Date;
    endTime: Date;
    slotStatus: SlotStatus;
}

export interface UpcomingSlotDetailsDTO {
    _id: string;
    profileImage: string;
    userName: string;
    userEmail: string;
    startTime: Date;
    endTime: Date;
    slotStatus: SlotStatus;
    cancellationReason: string | null;
}