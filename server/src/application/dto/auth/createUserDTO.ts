import { UserRole } from "../../../domain/enum/userEnums";
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
}