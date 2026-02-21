import { Model } from 'mongoose';
import { IVideoCallRepository } from '../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCall } from '../../domain/entities/videoCall/videoCallEntity';
import { VideoCallMapper } from '../../application/mappers/videoCallMappers';
import { VideoCallStatus } from '../../domain/enum/videoCallEnums';
import { BaseRepository } from './baseRepository';
import { IVideoCallModel } from '../database/models/videoCallModel';

export class VideoCallRepository extends BaseRepository<VideoCall, IVideoCallModel> implements IVideoCallRepository {
  constructor(protected _model: Model<IVideoCallModel>) {
    super(_model, VideoCallMapper);
  }

  async findBySlotId(slotId: string): Promise<VideoCall | null> {
    const videoCall = await this._model.findOne({ slotId });
    return videoCall ? VideoCallMapper.fromMongooseDocument(videoCall) : null;
  }

  

  async update(id: string, data: Partial<VideoCall>): Promise<VideoCall | null> {
    const updatedDoc = await this._model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });

    if (!updatedDoc) return null;
    return VideoCallMapper.fromMongooseDocument(updatedDoc);
  }

  async findAllExpiredSession(now: Date): Promise<VideoCall[]> {
    const videoCalls = await this._model.find({ endTime: { $lt: now }, status: {$in:[VideoCallStatus.WAITING, VideoCallStatus.ACTIVE]} });
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));
  }

async updateStatus(slotId: string, status: VideoCallStatus): Promise<void> {
   await this._model.updateOne({ slotId :slotId }, { $set: { status : status } });
}

}
