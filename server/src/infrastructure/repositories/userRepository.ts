import { User } from "../../domain/entities/user/userEntities";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { Model } from "mongoose";
import { UserMapper } from "../../application/mappers/userMappers";
import { IUserModel } from "../database/models/userModel";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
    constructor(protected _model:Model<IUserModel>) {
        super(_model)
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this._model.findOne({email});
        if(!doc) return null
        return UserMapper.fromMongooseDocument(doc)
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
        const doc = await this._model.findByIdAndUpdate(
            userId,
            {$set:data},
            {new:true, runValidators: true}  // ❌ Without validators: This would save!{ height: -100 } // Negative height!
        )

        if(!doc) return null

        return UserMapper.fromMongooseDocument(doc)
    }
    
}