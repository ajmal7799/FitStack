import { User } from "../../../../domain/entities/user/userEntities";
import { updateUserProfileRequest } from "../../../dto/user/profile/updateUserProfileDTO";
export interface IUpdateUserProfileUseCase {
    execute(userId: string, data: updateUserProfileRequest): Promise<User|null>;
}