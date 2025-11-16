import { User } from "../../domain/entities/user/userEntities";
import { UserRole } from "../../domain/enum/userEnums";
import { IUserModel } from "../../infrastructure/database/models/userModel";
import { CreateUserDTO } from "../dto/auth/createUserDTO";
import mongoose from "mongoose";
import { LoginUserDTO } from "../dto/auth/LoginUserDTO";

export class UserMapper {

    static toEntity(dto: CreateUserDTO): User {
        return {
            _id: new mongoose.Types.ObjectId().toString(),
            name: dto.name,
            email: dto.email,
            password: dto.password,
            phone: dto.phone,
            role: dto.role,
            isActive: true,
            // profileCompleted: false,
        }
    }

    static toLoginUserResponse(user: User): LoginUserDTO {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: true,
            
        }
    }

    static toLoginAdminResponse(user:User) : LoginUserDTO {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: true,
        }
    }

    static fromMongooseDocument(doc: IUserModel): User {
        return {
            _id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: doc.phone,
            role: doc.role,
            isActive: doc.isActive !== undefined ? doc.isActive : true,
            // profileImage: doc.profileImage,
            // dateOfBirth: doc.dateOfBirth,
            // gender: doc.gender,
            // height: doc.height,
            // weight: doc.weight,
            // targetWeight: doc.targetWeight,
            // fitnessGoal: doc.fitnessGoal,
            // experienceLevel: doc.experienceLevel,
            // preferredWorkoutType: doc.preferredWorkoutType,
            // medicalConditions: doc.medicalConditions,
            // dietPreference: doc.dietPreference,
            // waterIntakeGoal: doc.waterIntakeGoal,
            // profileCompleted: doc.profileCompleted || false,
        }
    }
}