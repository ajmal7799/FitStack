import { TrainerProfileDTO } from '../../dto/trainer/trainerProfileDTO';
export interface IGetProfileData {
    getProfileData(id: string): Promise<TrainerProfileDTO>;
}