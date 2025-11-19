import { UserGender, UserRole, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType,UserStatus } from "../../enum/userEnums";
export interface User {
    _id: string;

    // Auth fields
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    isActive: UserStatus;

    // // Basic Info
    //  profileImage?: string;
    // dateOfBirth?: Date;
    // gender?: UserGender;
    // height?: number;
    // weight?: number;
    // targetWeight?: number;

    // // Fitness Info
    // fitnessGoal?: FitnessGoal;
    // experienceLevel?: ExperienceLevel;
    //  preferredWorkoutType?: WorkoutType[];

    // // Health & Diet
    // medicalConditions?: string[];
    // dietPreference?: DietPreference;

    // // Goals & Tracking
    // waterIntakeGoal?: number;

    // profileCompleted: boolean;
}