import { Document, Model, model, Types } from 'mongoose';

import videoCallSchema from "../schema/videoCallSchema";
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';

export interface IVideoCallModel extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    trainerId: Types.ObjectId;
    slotId: Types.ObjectId;
    roomId: string;
    trainerJoined: boolean;
    userJoined: boolean;
    startedAt: Date | null | undefined;
    endedAt: Date | null | undefined;
    startTime: Date;
    endTime: Date;
    status: VideoCallStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const videoCallModel = model<IVideoCallModel>('VideoCall', videoCallSchema);