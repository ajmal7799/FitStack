import { User } from '../../entities/user/userEntities';
import { IBaseRepository } from './IBaseRepository';
import { UserStatus } from '../../enum/userEnums';
import { UserProfile } from '../../entities/user/userProfile';

export interface IUserRepository extends IBaseRepository<User>{
    findByEmail(email:string) : Promise<User | null>;
    findAllUsers(skip?: number, limit?: number, status?: string, search?: string): Promise<User[]>;
    countUsers(status?: string, search?: string): Promise<number>;
    updateStatus(userId: string, status: UserStatus): Promise<User | null>;
    findAllTrainer(skip?: number, limit?: number, status?: string, search?: string): Promise<User[]>;
    countTrainer(status?: string, search?: string): Promise<number>;
    findByIdAndUpdatePassword(email: string, hashedPassword: string): Promise<void>;
    googleSignUp(user: User): Promise<string>;
    updateUserProfileImage(userId: string, profileImage: string): Promise<void>;
    updateTrainerProfile(userId: string, profile: User): Promise<User | null>;
    
    updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void>;

    updateActiveMembershipId(userId: string, activeMembershipId: string | null): Promise<void>;
    updateUser(user: User): Promise<void>;
    findNonSubscribedUsers(): Promise<User[]>;
}
