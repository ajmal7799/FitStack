import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { Model } from "mongoose";
import { UserMapper } from "../../application/mappers/userMappers";
import { IUserModel } from "../database/models/userModel";
import { User } from "../../domain/entities/user/userEntities";
import { UserRole, UserStatus } from "../../domain/enum/userEnums";


export class UserRepository extends BaseRepository<User, IUserModel> implements IUserRepository {
    constructor(protected _model: Model<IUserModel>) {
        super(_model, UserMapper)
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this._model.findOne({ email });
        if (!doc) return null
        return UserMapper.fromMongooseDocument(doc)
    }

    async findAllUsers(skip = 0, limit = 10, isActive?: string, search?: string): Promise<User[]> {
        const query: any = {role: UserRole.USER};

        if (isActive) {
            query.isActive = isActive;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const docs = await this._model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return docs.map((doc) => UserMapper.fromMongooseDocument(doc));
    }

   async countUsers(isActive?: string, search?: string, extraQuery: any = {}): Promise<number> {

        const query: any = { ...extraQuery, role: UserRole.USER }

        if (isActive) query.isActive = isActive;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        
        return await this._model.countDocuments(query)
    }

   async updateStatus(userId: string, isActive: UserStatus): Promise<User | null> {
  
            const updatedDoc = await this._model.findByIdAndUpdate(userId, {isActive}, {new:true})
            

              if (!updatedDoc) return null;
              return  UserMapper.fromMongooseDocument(updatedDoc)
    }  


    
   async findAllTrainer(skip =0, limit =10,isActive?: string, search?: string): Promise<User[]> {
        const query: any = {role: UserRole.TRAINER};

        if (isActive) {
            query.isActive = isActive;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const docs = await this._model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return docs.map((doc) => UserMapper.fromMongooseDocument(doc));
    }

    async countTrainer(isActive?: string, search?: string, extraQuery: any = {}): Promise<number> {
         const query: any = { ...extraQuery, role: UserRole.TRAINER }

        if (isActive) query.isActive = isActive;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        
        return await this._model.countDocuments(query) 

    }
}