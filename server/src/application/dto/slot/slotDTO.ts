import { SlotStatus } from "../../../domain/enum/SlotEnums";
import { VideoCallStatus } from "../../../domain/enum/videoCallEnums";
export interface BookedSlotDTO {
    _id: string;
    trainerName: string;
    startTime: Date;
    endTime: Date;
    slotStatus: VideoCallStatus;
}


export interface BookedSlotDetailsDTO {
    _id: string;
    profileImage: string;
    trainerName: string;
    trainerEmail: string;
    startTime: Date;
    endTime: Date;
    slotStatus: VideoCallStatus;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    hasFeedback: boolean;
       feedback: {
        _id:       string;
        rating:    number;
        review?:   string;
        createdAt?: Date;
    } | null;

}


export interface BookedSlotsTrainerDTO {
    _id: string;
    userName: string;
    startTime: Date;
    endTime: Date;
    slotStatus: VideoCallStatus;
}

export interface UpcomingSlotDetailsDTO {
    _id: string;
    profileImage: string;
    userName: string;
    userEmail: string;
    startTime: Date;
    endTime: Date;
    slotStatus: VideoCallStatus;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    // cancellationReason: string | null;
}

export interface SessionHistoryResult {
    _id: string;
    trainerName: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
    rating ?: number;
}

export interface SessionHistoryTrainerResult {
    _id: string;
    userName: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
    rating ?: number;
}




export interface SessionHistoryDetailsResult {
    _id: string;
    trainerName: string;
    trainerEmail: string;
    profileImage: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    rating ?: number;
    review ?: string;
    createdAt ?: Date;

}

export interface SessionHistoryTrainerDetailsResult {
    _id: string;
    userName: string;
    userEmail: string;
    profileImage: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    rating ?: number;
    review ?: string;
    createdAt ?: Date;
}


export interface SessionHistoryAdminResult {
    _id: string;
    userName: string;
    trainerName: string;
    startTime: Date;
    endTime: Date;
    sessionStatus:  VideoCallStatus;
    rating ?: number;
}

export interface SessionResult {
    _id:string;
    userName: string;
    trainerName: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
}

export interface SessionHistoryAdminDetailsResult {
    _id: string;
    userName: string;
    userEmail: string;
    userNumber: string;
    userProfileImage: string;
    trainerName: string;
    trainerEmail: string;
    trainerNumber: string;
    trainerProfileImage: string;
    startTime: Date;
    endTime: Date;
    sessionStatus: VideoCallStatus;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    rating ?: number;
    review ?: string;
    createdAt ?: Date;
}