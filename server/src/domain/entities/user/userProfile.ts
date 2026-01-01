import { UserGender, DietPreference,ExperienceLevel,FitnessGoal,PreferredWorkoutType,WorkoutLocation } from '../../enum/userProfileEnums';

export interface UserProfile {
    id: string,
    userId: string,
    age: number,
    gender: UserGender,
    height: number,
    weight: number,
    

    fitnessGoal: FitnessGoal,
    targetWeight: number,
    dietPreference?: DietPreference,
    experienceLevel: ExperienceLevel,
    workoutLocation: WorkoutLocation    

    preferredWorkoutTypes?: string[],
    medicalConditions?: string[],
    profileCompleted: boolean
}
  