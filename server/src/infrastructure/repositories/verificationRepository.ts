import { BaseRepository } from './baseRepository';
import { TrainerVerification } from '../../domain/entities/trainer/verification';
import { IVerificationModel } from '../database/models/verificationModel';
import { IUpdateVerification } from '../../domain/interfaces/repositories/IVerificationRepository';
import { Model } from 'mongoose';
import { VerificationMapper } from '../../application/mappers/verificationMappers';
import { Trainer } from '../../domain/entities/trainer/trainerEntities';
import { User } from '../../domain/entities/user/userEntities';
import { PipelineStage } from 'mongoose';
import { TrainerMapper } from '../../application/mappers/trainerMappers';
import { UserMapper } from '../../application/mappers/userMappers';
import { NotFoundException } from '../../application/constants/exceptions';
import { TRAINER_ERRORS } from '../../shared/constants/error';
import { VerificationStatus } from '../../domain/enum/verificationStatus';

export class VerificationRepository
  extends BaseRepository<TrainerVerification, IVerificationModel>
  implements IUpdateVerification
{
  constructor(protected _model: Model<IVerificationModel>) {
    super(_model, VerificationMapper);
  }

  async updateTrainerVerification(
    trainerId: string,
    data: Partial<TrainerVerification>
  ): Promise<TrainerVerification | null> {
    const updatedDoc = await this._model.findOneAndUpdate(
      { trainerId: trainerId },
      { $set: data },
      { new: true, upsert: true }
    );
    if (!updatedDoc) return null;
    return VerificationMapper.fromMongooseDocument(updatedDoc);
  }

  async findByTrainerId(trainerId: string): Promise<TrainerVerification | null> {
    const verificationDoc = await this._model.findOne({ trainerId: trainerId });

    if (!verificationDoc) {
      return null;
    }

    return VerificationMapper.fromMongooseDocument(verificationDoc);
  }

  async findAllVerification(
    skip?: number,
    limit?: number,
    status?: string,
    search?: string
  ): Promise<{ verification: TrainerVerification; trainer: Trainer; user: User }[]> {
    const pipeline: PipelineStage[] = [];
    pipeline.push(
      {
        $lookup: {
          from: 'trainers',
          localField: 'trainerId',
          foreignField: 'trainerId',
          as: 'trainerData',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { trainerIdStr: '$trainerId' },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] } } }],
          as: 'userData',
        },
      },
      { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } }
    );

    const matchStage: any = {};

    if (status) {
      matchStage.verificationStatus = status;
    }

    if (search) {
      matchStage.$or = [
        { 'userData.name': { $regex: search, $options: 'i' } },
        { 'userData.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    if (skip) pipeline.push({ $skip: skip });
    if (limit) pipeline.push({ $limit: limit });

    const docs = await this._model.aggregate(pipeline).exec();
    return docs.map(doc => ({
      verification: VerificationMapper.fromMongooseDocument(doc),
      trainer: TrainerMapper.fromMongooseDocument(doc.trainerData),
      user: UserMapper.fromMongooseDocument(doc.userData),
    }));
  }

  async countVerifications(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const pipeline: PipelineStage[] = [];

    const matchStage: any = { ...extraQuery };

    if (status) matchStage.verificationStatus = status;

    pipeline.push(
      {
        $lookup: {
          from: 'users',
          let: { trainerIdStr: '$trainerId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] },
              },
            },
          ],
          as: 'userData',
        },
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } }
    );

    if (search) {
      matchStage.$or = [
        { 'userData.name': { $regex: search, $options: 'i' } },
        { 'userData.email': { $regex: search, $options: 'i' } },
      ];
    }

    pipeline.push({ $match: matchStage });

    pipeline.push({ $count: 'count' });

    const result = await this._model.aggregate(pipeline).exec();
    return result.length > 0 ? result[0].count : 0;
  }

  async findVerificationByTrainerId(
    trainerId: string
  ): Promise<{ verification: TrainerVerification; trainer: Trainer; user: User }> {
    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: { trainerId },
    });
    pipeline.push({
      $lookup: {
        from: 'trainers',
        localField: 'trainerId',
        foreignField: 'trainerId',
        as: 'trainerData',
      },
    });

    // Lookup user
    pipeline.push({
      $lookup: {
        from: 'users',
        let: { trainerIdStr: '$trainerId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] },
            },
          },
        ],
        as: 'userData',
      },
    });

    pipeline.push(
      { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } }
    );
    const docs = await this._model.aggregate(pipeline).exec();
    if (!docs || docs.length === 0) {
      throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
    }
    const doc = docs[0];

    return {
      verification: VerificationMapper.fromMongooseDocument(doc),
      trainer: TrainerMapper.fromMongooseDocument(doc.trainerData),
      user: UserMapper.fromMongooseDocument(doc.userData),
    };
  }

  async verifyTrainer(trainerId: string): Promise<TrainerVerification | null> {
    const updatedDoc = await this._model.findOneAndUpdate(
      { trainerId: trainerId },
      { $set: { verificationStatus: VerificationStatus.VERIFIED, rejectionReason: null } },
      { new: true, upsert: true }
    );
    if (!updatedDoc) return null;
    return VerificationMapper.fromMongooseDocument(updatedDoc);
  }

  async rejectTrainer(trainerId: string, rejectionReason: string): Promise<TrainerVerification | null> {
    const updatedDoc = await this._model.findOneAndUpdate(
      { trainerId: trainerId },
      { $set: { verificationStatus: VerificationStatus.REJECTED, rejectionReason: rejectionReason } },
      { new: true, upsert: true }
    );
    if (!updatedDoc) return null;
    return VerificationMapper.fromMongooseDocument(updatedDoc);
  }

  async allVerifiedTrainer(
    skip?: number,
    limit?: number
  ): Promise<{ trainer: Trainer; verification: TrainerVerification; user: User }[]> {
    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: { verificationStatus: VerificationStatus.VERIFIED },
    });

    pipeline.push(
      {
        $lookup: {
          from: 'trainers',
          localField: 'trainerId',
          foreignField: 'trainerId',
          as: 'trainerData',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { trainerIdStr: '$trainerId' },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$trainerIdStr'] } } }],
          as: 'userData',
        },
      },
      { $unwind: { path: '$trainerData', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } }
    );

    if (skip) pipeline.push({ $skip: skip });
    if (limit) pipeline.push({ $limit: limit });
    const docs = await this._model.aggregate(pipeline).exec();

    return docs.map(doc => ({
      verification: VerificationMapper.fromMongooseDocument(doc),
      trainer: TrainerMapper.fromMongooseDocument(doc.trainerData),
      user: UserMapper.fromMongooseDocument(doc.userData),
    }));
  }

  async countVerifiedTrainer(): Promise<number> {
     return await this._model.countDocuments({
    verificationStatus: VerificationStatus.VERIFIED
  });
  }


}
