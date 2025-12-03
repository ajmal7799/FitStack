import { TrainerGetVerificationDTO } from "../../dto/trainer/trainerGetVerificationDTO";
export interface IGetVerificationData {
   getVerificationData(trainerId: string): Promise<TrainerGetVerificationDTO>;
}