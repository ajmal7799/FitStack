import userProfileSchema from '../schema/userProfileSchema';
import { Document, model, Types } from 'mongoose';
import { UserGender, DietPreference, ExperienceLevel,FitnessGoal,PreferredWorkoutType,WorkoutLocation } from '../../../domain/enum/userProfileEnums';


export interface IUserProfileModel extends Document {
    _id: Types.ObjectId;
    userId: string;
    age: number;
    gender: UserGender;
    height: number;
    weight: number;
    fitnessGoal: FitnessGoal;
    targetWeight: number;
    dietPreference?: DietPreference;
    experienceLevel: ExperienceLevel;
    workoutLocation: WorkoutLocation;
    preferredWorkoutTypes: string[];
    medicalConditions?: string[];
    profileCompleted: boolean;
  
}

export const userProfileModel = model<IUserProfileModel>('UserProfile', userProfileSchema);