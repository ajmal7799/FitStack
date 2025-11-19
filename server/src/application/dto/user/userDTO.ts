import { UserRole,UserStatus, UserGender, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType } from "../../../domain/enum/userEnums";

export interface UserDTO {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    isActive: UserStatus;
}
