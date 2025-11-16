import { Document, model } from "mongoose";
import {
    UserGender,
    UserRole,
    FitnessGoal,
    ExperienceLevel,
    DietPreference,
    WorkoutType
} from "../../../domain/enum/userEnums";
import userSchema from "../schema/userSchema";

export interface IUserModel extends Document {
    _id: string;

    // Auth fields
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    isActive: boolean;

    // Basic Info
    // profileImage?: string;
    // dateOfBirth?: Date;
    // gender?: UserGender;
    // height?: number;
    // weight?: number;
    // targetWeight?: number;

    // // Fitness Info
    // fitnessGoal?: FitnessGoal;
    // experienceLevel?: ExperienceLevel;
    // preferredWorkoutType?: WorkoutType[];

    // // Health & Diet
    // medicalConditions?: string[];
    // dietPreference?: DietPreference;

    // // Goals & Tracking
    // waterIntakeGoal?: number;

    // // Tracking
    // profileCompleted: boolean;

    // // Timestamps (Document already provides these, but good to be explicit)
    // createdAt: Date;
    // updatedAt: Date;
}

export const userModel = model<IUserModel>("User", userSchema);
