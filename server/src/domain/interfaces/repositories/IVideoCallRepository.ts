import { IBaseRepository } from "./IBaseRepository";
import { VideoCall } from "../../entities/videoCall/videoCallEntity";
import { VideoCallStatus } from "../../enum/videoCallEnums";

export interface IVideoCallRepository extends IBaseRepository< VideoCall> {
    findBySlotId(slotId: string): Promise<VideoCall | null>;
    update(id: string, data: Partial<VideoCall>): Promise<VideoCall | null>;

    findAllExpiredSession( now: Date): Promise<VideoCall[]>
    updateStatus(slotId: string, status: VideoCallStatus): Promise<void>
    findSessionsByUserId(userId: string, skip: number, limit: number): Promise<VideoCall[]>;
    countSessionsByUserId(userId: string, status?: VideoCallStatus): Promise<number>;
    findSessionsByTrainerId(trainerId: string, skip: number, limit: number,): Promise<VideoCall[]>;
    countSessionsByTrainerId(trainerId: string, ): Promise<number>;
    findSessionsForAdmin(skip: number, limit: number, status?: string, search?: string): Promise<VideoCall[]>;
    countSessionsForAdmin(status?: string, search?: string): Promise<number>;
    findAllBookedSessionByUserId(userId: string, skip: number, limit: number, status: VideoCallStatus): Promise<VideoCall[]>
    countBookedSessionByUserId(userId: string, status?: VideoCallStatus): Promise<number>
    findAllBookedSessionByTrainerId(trainerId: string, skip: number, limit: number, status?: VideoCallStatus): Promise<VideoCall[]>
    countBookedSessionByTrainerId(trainerId: string, status?: VideoCallStatus): Promise<number>
    
    
}