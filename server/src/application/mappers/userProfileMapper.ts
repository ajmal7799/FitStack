import { IUserProfileModel } from "../../infrastructure/database/models/userProfileModel";
import { UserProfile } from "../../domain/entities/user/userProfile";
import { userProfileGetVerficationDTO } from "../dto/user/createUserProfileDTO";
import mongoose from 'mongoose';

export class UserProfileMapper {
    static fromMongooseDocument(doc: IUserProfileModel) : UserProfile{
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            age: doc.age,
            gender: doc.gender,
            height: doc.height,
            weight: doc.weight,
            profileImage: doc.profileImage ,
            fitnessGoal: doc.fitnessGoal,
            targetWeight: doc.targetWeight,
            dietPreference: doc.dietPreference,
            experienceLevel: doc.experienceLevel,
            workoutLocation: doc.workoutLocation,
            preferredWorkoutTypes: doc.preferredWorkoutTypes,
            medicalConditions: doc.medicalConditions,
            profileCompleted: doc.profileCompleted
         
        }
    }

    static mapToGetUserProfileDTO(doc: UserProfile): userProfileGetVerficationDTO {
        return {
            userId: doc.userId,
            age: doc.age,
            gender: doc.gender,
            height: doc.height,
            weight: doc.weight,
            profileImage: doc.profileImage ,
            fitnessGoal: doc.fitnessGoal,
            targetWeight: doc.targetWeight,
            dietPreference: doc.dietPreference,
            experienceLevel: doc.experienceLevel,
            workoutLocation: doc.workoutLocation,
            preferredWorkoutTypes: doc.preferredWorkoutTypes,
            medicalConditions: doc.medicalConditions,
            profileCompleted: doc.profileCompleted,
        }
    }
}