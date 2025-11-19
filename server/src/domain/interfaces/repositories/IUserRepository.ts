import { User } from "../../entities/user/userEntities";
import { IBaseRepository } from "./IBaseRepository";
import { UserStatus } from "../../enum/userEnums";

export interface IUserRepository extends IBaseRepository<User>{
    findByEmail(email:string) : Promise<User | null>;
    findAllUsers(skip?: number, limit?: number, status?: string, search?: string): Promise<User[]>;
    countUsers(status?: string, search?: string): Promise<number>;
    updateStatus(userId: string, status: UserStatus): Promise<User | null>;
    findAllTrainer(skip?: number, limit?: number, status?: string, search?: string): Promise<User[]>;
    countTrainer(status?: string, search?: string): Promise<number>;
}
