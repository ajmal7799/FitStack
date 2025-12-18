import { userProfileGetVerficationDTO } from "../../../dto/user/createUserProfileDTO";

export interface IGetPersonalInfoUseCase {
    execute(userId: string): Promise<userProfileGetVerficationDTO>;
}