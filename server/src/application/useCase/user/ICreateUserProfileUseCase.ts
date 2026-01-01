import { createUserProfileRequest,createUserProfileResponse } from '../../dto/user/profile/createUserBodyMetricsDTO';

export interface ICreateUserProfileUseCase {
    createUserProfile(data: createUserProfileRequest): Promise<createUserProfileResponse>;
}