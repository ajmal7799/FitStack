import { UserRole } from "../../enum/userEnums";

export interface Trainer {
    _id: string;
    // Auth fields
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
}