import { UserRole } from "../../domain/enum/userEnums";

export interface ISignupInput {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}

export type ISignupOutput = string