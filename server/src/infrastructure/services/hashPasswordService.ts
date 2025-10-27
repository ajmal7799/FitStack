import bcrypt from "bcryptjs";
import { IHashedPasswordServices } from "../../domain/interfaces/services/IHashPasswordServices";
import { CONFIG } from "../config/config";

export class HashPassword implements IHashedPasswordServices {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password,10)
    }
    async comparePassword(password: string, hashedPassoword: string): Promise<boolean> {
        return bcrypt.compare(password,hashedPassoword)
    }
}