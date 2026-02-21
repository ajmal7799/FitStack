import { IBaseRepository } from "./IBaseRepository";
import { VideoCall } from "../../entities/videoCall/videoCallEntity";
import { VideoCallStatus } from "../../enum/videoCallEnums";

export interface IVideoCallRepository extends IBaseRepository< VideoCall> {
    findBySlotId(slotId: string): Promise<VideoCall | null>;
    update(id: string, data: Partial<VideoCall>): Promise<VideoCall | null>;

    findAllExpiredSession( now: Date): Promise<VideoCall[]>
    updateStatus(slotId: string, status: VideoCallStatus): Promise<void>
    
    
}