import { User } from "../../../../domain/entities/user/userEntities";

export interface INonSubscribedUserUseCase {
    getNonSubscribedUsers(userId: string): Promise<User[]>;
}