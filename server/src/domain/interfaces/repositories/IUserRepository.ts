import { User } from "../../entities/user/userEntities";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User>{
    findByEmail(email:string) : Promise<User | null>
    updateProfile(userId: string, data: Partial<User>) : Promise<User|null>;
}
