
import { TrainerProfileDTO } from '../../../dto/trainer/profile/trainerProfileDTO';
export interface IGetProfileData {
    getProfileData(id: string): Promise<TrainerProfileDTO>;
}