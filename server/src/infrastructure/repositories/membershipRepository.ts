import { BaseRepository } from "./baseRepository";
import { Membership } from "../../domain/entities/membership/MembershipEntity";
import { IMembershipModel } from "../database/models/membershipModel";
import { IMembershipRepository } from "../../domain/interfaces/repositories/IMembershipRepository";
import { MembershipMapper } from "../../application/mappers/membershipMappers";
import { Model } from "mongoose";
import { Subscription } from "../../domain/entities/admin/subscriptionEntities";

export class MembershipRepository extends BaseRepository<Membership, IMembershipModel> implements IMembershipRepository {
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
    const updatedDoc = await this._model.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedDoc) return null;
    return MembershipMapper.fromMongooseDocument(updatedDoc);
  }

}