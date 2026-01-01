import { userProfileGetVerficationDTO } from '../../../dto/user/profile/createUserBodyMetricsDTO';

export interface IGetPersonalInfoUseCase {
    execute(userId: string): Promise<userProfileGetVerficationDTO>;
}