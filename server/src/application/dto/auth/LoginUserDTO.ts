import { UserRole, UserGender, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType } from "../../../domain/enum/userEnums";

export interface LoginUserDTO {
    _id: string;

    // Auth fields
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
}
