import { Model } from 'mongoose';
import { UserProfile } from '../../domain/entities/user/userProfile';
import { IUserProfileRepository } from '../../domain/interfaces/repositories/IUserProfileRepository';
import { IUserProfileModel } from '../database/models/userProfileModel';
import { UserProfileMapper } from '../../application/mappers/userProfileMapper';
import { BaseRepository } from './baseRepository';

export class UserProfileRepository
    extends BaseRepository<UserProfile, IUserProfileModel>
    implements IUserProfileRepository
{
    constructor(protected _model: Model<IUserProfileModel>) {
        super(_model, UserProfileMapper);
    }

    async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {

        const updatedDocs = await this._model.findOneAndUpdate({ userId: userId }, { $set: data }, { new: true, upsert: true });
    
        if (!updatedDocs) return null;
        return UserProfileMapper.fromMongooseDocument(updatedDocs);
    }

    async findByUserId(userId: string): Promise<UserProfile | null> {
        const userProfile = await this._model.findOne({ userId: userId });
    
        if (!userProfile) return null;
        return UserProfileMapper.fromMongooseDocument(userProfile);
    }

    async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
        const updatedDocs = await this._model.findOneAndUpdate({ userId: userId }, { $set: data }, { new: true, upsert: true });
        if (!updatedDocs) return null;
        return UserProfileMapper.fromMongooseDocument(updatedDocs);
    }

}
