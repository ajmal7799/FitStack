import { ISubscriptionRepository } from '../../domain/interfaces/repositories/ISubscriptionRepository';
import { BaseRepository } from './baseRepository';
import { Subscription } from '../../domain/entities/admin/subscriptionEntities';
import { ISubscriptionModel } from '../database/models/subscriptionModel';

import { SubscriptionMapper } from '../../application/mappers/subscriptionMappers';
import { SubscriptionStatus } from '../../domain/enum/subscriptionStatus';
import type { FilterQuery, Model } from 'mongoose';

export class SubscriptionRepository extends BaseRepository<Subscription, ISubscriptionModel> implements ISubscriptionRepository  {
    constructor(protected _model: Model<ISubscriptionModel>) {
        super(_model, SubscriptionMapper);
    }

    async findByName(name: string): Promise<Subscription | null> {
        const normalized = name.trim().toUpperCase();
        
        const doc = await this._model.findOne({ planName: normalized });
        if (!doc) return null;
        return SubscriptionMapper.fromMongooseDocument(doc);
    }

    async findAllSubscriptions(skip =0, limit =10, status?: string, search?: string): Promise<Subscription[]> { //skip?: number, limit?: number, status?: string, search?: string): Promise<Subscription[]> {
        const query: FilterQuery<ISubscriptionModel> = {};
        
        if (status) {
            query.isActive = status;
        }

        if (search) {
            query.planName = { $regex: search, $options: 'i' };
        }

        const docs = await this._model
            .find(query)
            .skip(skip)
            .limit(limit )
            .sort({ createdAt: -1 });
        
        return docs.map((doc) => SubscriptionMapper.fromMongooseDocument(doc));
    }


    async countSubscriptions(status?: string, search?: string, extraQuery: FilterQuery<ISubscriptionModel> = {}): Promise<number> {
        const query = { ...extraQuery };

        if (status) {
            query.isActive = status;
        }

        if (search) {
            query.planName = { $regex: search, $options: 'i' };
        }
       
        return await this._model.countDocuments(query);
    }

    async updateStatus(id: string, status: string): Promise<Subscription | null> {
        const doc = await this._model.findOneAndUpdate({ _id: id }, { isActive: status }, { new: true });
        if (!doc) return null;
        return SubscriptionMapper.fromMongooseDocument(doc);
    }


    async findAllSubscriptionsInUserSide(skip=0, limit=10): Promise<Subscription[]> {
        const query  = { isActive: SubscriptionStatus.ACTIVE };

        const docs = await this._model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        return docs.map((doc) => SubscriptionMapper.fromMongooseDocument(doc));
    }

    async countSubscriptionsInUserSide(): Promise<number> {
        const query  = { isActive: SubscriptionStatus.ACTIVE };
        return await this._model.countDocuments(query);
    }

    async findByIdAndUpdate(data: Subscription): Promise<Subscription | null> {
        const doc = await this._model.findOneAndUpdate({ _id: data._id }, data, { new: true });
        if (!doc) return null;
        return SubscriptionMapper.fromMongooseDocument(doc);
    }

    
}