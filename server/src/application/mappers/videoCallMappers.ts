import mongoose, { Mongoose } from 'mongoose';
import { VideoCall } from '../../domain/entities/videoCall/videoCallEntity';
import { VideoCallStatus } from '../../domain/enum/videoCallEnums';
import { IVideoCallModel } from '../../infrastructure/database/models/videoCallModel';
import { CreateVideoCallDTO } from '../dto/videoCall/videoCallDTO';

export class VideoCallMapper {
  static toMongooseDocument(videoCall: VideoCall) {
    return {
      _id: new mongoose.Types.ObjectId(videoCall._id),
      userId: new mongoose.Types.ObjectId(videoCall.userId),
      trainerId: new mongoose.Types.ObjectId(videoCall.trainerId),
      slotId: new mongoose.Types.ObjectId(videoCall.slotId),
      roomId: videoCall.roomId,
      trainerJoined: videoCall.trainerJoined,
      userJoined: videoCall.userJoined,
      startedAt: videoCall.startedAt,
      endedAt: videoCall.endedAt,
      startTime: videoCall.startTime,
      endTime: videoCall.endTime,
      status: videoCall.status,
      cancellationReason: videoCall.cancellationReason,
      cancelledAt: videoCall.cancelledAt,
      cancelledBy: videoCall.cancelledBy,
    };
  }

  static fromMongooseDocument(videoCall: IVideoCallModel): VideoCall {
    return {
      _id: videoCall._id.toString(),
      userId: videoCall.userId.toString(),
      trainerId: videoCall.trainerId.toString(),
      slotId: videoCall.slotId.toString(),
      roomId: videoCall.roomId,
      trainerJoined: videoCall.trainerJoined,
      userJoined: videoCall.userJoined,
      startedAt: videoCall.startedAt,
      endedAt: videoCall.endedAt,
      startTime: videoCall.startTime,
      endTime: videoCall.endTime,
      status: videoCall.status,
      cancellationReason: videoCall.cancellationReason,
      cancelledAt: videoCall.cancelledAt,
      cancelledBy: videoCall.cancelledBy,
    };
  }

  static toEnitity(videoCall: CreateVideoCallDTO): VideoCall {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: videoCall.userId,
      trainerId: videoCall.trainerId,
      slotId: videoCall.slotId,
      roomId: videoCall.roomId,
      trainerJoined: videoCall.trainerJoined,
      userJoined: videoCall.userJoined,
      startedAt: videoCall.startedAt,
      endedAt: videoCall.endedAt,
      startTime: videoCall.startTime,
      endTime: videoCall.endTime,
      status: videoCall.status,
      cancellationReason: videoCall.cancellationReason,
      cancelledAt: videoCall.cancelledAt,
      cancelledBy: videoCall.cancelledBy,
    };
  }
}
