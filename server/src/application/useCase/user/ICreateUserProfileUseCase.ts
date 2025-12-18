import { createUserProfileRequest,createUserProfileResponse} from "../../dto/user/createUserProfileDTO";

export interface ICreateUserProfileUseCase {
    createUserProfile(data: createUserProfileRequest): Promise<createUserProfileResponse>;
}