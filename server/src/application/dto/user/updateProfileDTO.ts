import { UserGender, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType } from '../../../domain/enum/userEnums';

export interface UpdateProfileDTO {
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
    height?: number;
    weight?: number;
    targetWeight?: number;
    fitnessGoal?: FitnessGoal;
    experienceLevel?: ExperienceLevel;
    preferredWorkoutType?: WorkoutType[];
    medicalConditions?: string[];
    dietPreference?: DietPreference;
    waterIntakeGoal?: number;
}
