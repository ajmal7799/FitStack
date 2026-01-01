import { BaseRepository } from './baseRepository';
import { Membership } from '../../domain/entities/membership/MembershipEntity';
import { IMembershipModel } from '../database/models/membershipModel';
import { IMembershipRepository } from '../../domain/interfaces/repositories/IMembershipRepository';
import { MembershipMapper } from '../../application/mappers/membershipMappers';
import { Model, PipelineStage,Types } from 'mongoose';
import { Subscription } from '../../domain/entities/admin/subscriptionEntities';
import { SubscriptionMapper } from '../../application/mappers/subscriptionMappers';

export class MembershipRepository
  extends BaseRepository<Membership, IMembershipModel>
  implements IMembershipRepository
{
  constructor(protected _model: Model<IMembershipModel>) {
    super(_model, MembershipMapper);
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Membership | null> {
    const membershipDoc = await this._model.findOne({ subscriptionId: subscriptionId });

    if (!membershipDoc) {
      return null;
    }

    return MembershipMapper.fromMongooseDocument(membershipDoc);
  }

  async updateStatus(id: string, status: string): Promise<Membership | null> {
    const updatedDoc = await this._model.findOneAndUpdate({ _id: id }, { $set: { status: status } }, { new: true });

    if (!updatedDoc) return null;
    return MembershipMapper.fromMongooseDocument(updatedDoc);
  }

  async findByUserId(userId: string): Promise<Membership | null> {
    const membershipDoc = await this._model.findOne({ userId: userId });

    if (!membershipDoc) {
      return null;
    }

    return MembershipMapper.fromMongooseDocument(membershipDoc);
  }

 async findActiveMembershipsWithSubscription(userId: string): Promise<{ membership: Membership; subscription: Subscription; }[]> {
      const pipeline: PipelineStage[] = [];

      pipeline.push(
        {
            $match:{userId: userId}
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'planId',
                foreignField: '_id',
                as: 'subscriptionData',
            },
        },
        {
            $unwind: {
                path: '$subscriptionData',
                preserveNullAndEmptyArrays: true,
            },
        }
      )
        const results = await this._model.aggregate(pipeline);
        
        return results.map((result) => ({
            membership: MembershipMapper.fromMongooseDocument(result),
            subscription: SubscriptionMapper.fromMongooseDocument(result.subscriptionData),
        }));
  }
}
