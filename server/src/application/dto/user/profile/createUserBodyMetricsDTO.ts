import { UserGender,DietPreference,ExperienceLevel,FitnessGoal,WorkoutLocation,PreferredWorkoutType } from '../../../../domain/enum/userProfileEnums';
import { UserProfile } from '../../../../domain/entities/user/userProfile';
export interface createUserProfileRequest {

    userId: string,

    age: number,
    gender: UserGender,
    height: number,
    weight: number,
    fitnessGoal: FitnessGoal,
    targetWeight: number,
    experienceLevel: ExperienceLevel,
    workoutLocation: WorkoutLocation

    dietPreference?: DietPreference,
    preferredWorkoutTypes?: string[],
    medicalConditions?: string[]
}


export interface createUserProfileResponse {
    userProfile: UserProfile
}

export interface userProfileGetVerficationDTO {
    userId: string;
    age: number;
    gender: UserGender;
    height: number;
    weight: number;
    profileImage?: string;

    fitnessGoal: FitnessGoal;
    targetWeight: number;
    dietPreference?: DietPreference;
    experienceLevel: ExperienceLevel;
    workoutLocation: WorkoutLocation;

    preferredWorkoutTypes?: string[]; 
    medicalConditions?: string[];     
    profileCompleted: boolean;
}