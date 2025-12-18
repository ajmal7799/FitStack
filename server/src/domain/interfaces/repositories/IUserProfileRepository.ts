import { IBaseRepository } from "./IBaseRepository";
import { UserProfile } from "../../entities/user/userProfile";


export interface IUserProfileRepository extends IBaseRepository<UserProfile> {
    createUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null>;
    findByUserId(userId: string): Promise<UserProfile | null>;
}