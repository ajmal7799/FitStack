import { UserRole, UserGender, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType } from "../../../domain/enum/userEnums";

export interface LoginUserDTO {
    _id: string;

    // Auth fields
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    profileCompleted: boolean;

    // Profile fields (all optional)
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
