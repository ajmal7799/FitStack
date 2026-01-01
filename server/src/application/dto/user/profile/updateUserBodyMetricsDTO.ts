import { UserGender,DietPreference,ExperienceLevel,FitnessGoal,WorkoutLocation,PreferredWorkoutType } from "../../../../domain/enum/userProfileEnums";
import { UserProfile } from "../../../../domain/entities/user/userProfile";

export interface updateUserBodyMetricsRequestDTO {
   age?: number,
    gender?: UserGender,
    height?: number,
    weight?: number,
    fitnessGoal?: FitnessGoal,
    targetWeight?: number,
    experienceLevel?: ExperienceLevel,
    workoutLocation?: WorkoutLocation

    dietPreference?: DietPreference,
    preferredWorkoutTypes?: string[],
    medicalConditions?: string[]
}


export interface updateUserBodyMetricsResponseDTO {
    userProfile: UserProfile    
}