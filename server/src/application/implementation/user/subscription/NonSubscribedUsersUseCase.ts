import { INonSubscribedUserUseCase } from "../../../useCase/user/subscription/INonSubscribedUserUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../../../domain/entities/user/userEntities";

export class NonSubscribedUsersUseCase implements INonSubscribedUserUseCase {
    constructor(
        private _userRepository: IUserRepository
    ){}

   async getNonSubscribedUsers(userId: string): Promise<User[]> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const nonSubscribedUsers = await this._userRepository.findNonSubscribedUsers();
        return nonSubscribedUsers;
        
    }
}