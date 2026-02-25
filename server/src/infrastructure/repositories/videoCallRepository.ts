import { Model } from 'mongoose';
import { IVideoCallRepository } from '../../domain/interfaces/repositories/IVideoCallRepository';
import { VideoCall } from '../../domain/entities/videoCall/videoCallEntity';
import { VideoCallMapper } from '../../application/mappers/videoCallMappers';
import { VideoCallStatus } from '../../domain/enum/videoCallEnums';
import { BaseRepository } from './baseRepository';
import { IVideoCallModel } from '../database/models/videoCallModel';
import { FilterQuery, SortOrder, PipelineStage } from 'mongoose';

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
    const videoCalls = await this._model.find({
      endTime: { $lt: now },
      status: { $in: [VideoCallStatus.WAITING, VideoCallStatus.ACTIVE] },
    });
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));
  }

  async updateStatus(slotId: string, status: VideoCallStatus): Promise<void> {
    await this._model.updateOne({ slotId: slotId }, { $set: { status: status } });
  }

  async findSessionsByUserId(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<VideoCall[]> {
    const filter: FilterQuery<IVideoCallModel> = {
      userId: userId,
      status: VideoCallStatus.COMPLETED,
    };
    
    const videoCalls = await this._model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit);
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));
  }

  async countSessionsByUserId(userId: string, status?: VideoCallStatus): Promise<number> {
    const filter: FilterQuery<IVideoCallModel> = {
      userId: userId,
      status: { $in: [VideoCallStatus.COMPLETED] },
    };
    if (status) {
      filter.status = status;
    }
    return await this._model.countDocuments(filter);
  }

  async findSessionsByTrainerId(
    trainerId: string,
    skip: number,
    limit: number,
  ): Promise<VideoCall[]> {
    const filter: FilterQuery<IVideoCallModel> = {
      trainerId: trainerId,
      status: VideoCallStatus.COMPLETED,
    };
    
    const videoCalls = await this._model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit);
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));
  }

  async countSessionsByTrainerId(trainerId: string): Promise<number> {
    const filter: FilterQuery<IVideoCallModel> = {
      trainerId: trainerId,
      status: VideoCallStatus.COMPLETED,
    };
   
    return await this._model.countDocuments(filter);
  }

  async findSessionsForAdmin(skip: number, limit: number, status?: string, search?: string): Promise<VideoCall[]> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDoc',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'trainerId',
          foreignField: '_id',
          as: 'trainerDoc',
        },
      },
      {
        $match: {
          ...(status && { status }),
          ...(search && {
            $or: [
              { 'userDoc.name': { $regex: search, $options: 'i' } },
              { 'trainerDoc.name': { $regex: search, $options: 'i' } },
            ],
          }),
        },
      },
      { $sort: { startTime: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const result = await this._model.aggregate(pipeline);

    return result.map(doc => {
      const videoCall = VideoCallMapper.fromMongooseDocument(doc);
      (videoCall as any).userName = doc.userDoc[0]?.name;
      (videoCall as any).trainerName = doc.trainerDoc[0]?.name;
      return videoCall;
    });
  }

  async countSessionsForAdmin(status?: string, search?: string): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDoc',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'trainerId',
          foreignField: '_id',
          as: 'trainerDoc',
        },
      },
      {
        $match: {
          ...(status && { status }),
          ...(search && {
            $or: [
              { 'userDoc.name': { $regex: search, $options: 'i' } },
              { 'trainerDoc.name': { $regex: search, $options: 'i' } },
            ],
          }),
        },
      },
      { $count: 'total' },
    ];

    const result = await this._model.aggregate(pipeline);

    return result[0]?.total || 0;
  }



 async findAllBookedSessionByUserId(userId: string, skip: number, limit: number, status: VideoCallStatus): Promise<VideoCall[]> {
   const filter: FilterQuery<IVideoCallModel> = {
      userId: userId,
      // status: { $in: [VideoCallStatus.ACTIVE, VideoCallStatus.WAITING] },
    };

    if (status) {
      filter.status = status;
    }

    const videoCalls = await this._model.find(filter).sort({ startTime: 1 }).skip(skip).limit(limit);
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));


  } 

 async countBookedSessionByUserId(userId: string, status?: VideoCallStatus): Promise<number> {
    const filter: FilterQuery<IVideoCallModel> = {
      userId: userId,
      // status: { $in: [VideoCallStatus.ACTIVE, VideoCallStatus.WAITING] },
    };
    if (status) {
      filter.status = status;
    }
    return await this._model.countDocuments(filter);
    
  }


 async findAllBookedSessionByTrainerId(trainerId: string, skip: number, limit: number, status?: VideoCallStatus): Promise<VideoCall[]> {
    const filter: FilterQuery<IVideoCallModel> = {
      trainerId: trainerId,
      // status: { $in: [VideoCallStatus.ACTIVE, VideoCallStatus.WAITING] },
    };
    if (status) {
      filter.status = status;
    }

    const videoCalls = await this._model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit);
    return videoCalls.map(videoCall => VideoCallMapper.fromMongooseDocument(videoCall));
    
  }

 async countBookedSessionByTrainerId(trainerId: string, status?: VideoCallStatus): Promise<number> {
    const filter: FilterQuery<IVideoCallModel> = {
      trainerId: trainerId,
    };
    if (status) {
      filter.status = status;
    }
    return this._model.countDocuments(filter);
  }

}
