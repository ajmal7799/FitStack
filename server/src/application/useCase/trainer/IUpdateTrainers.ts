import { SubmitTrainerVerificationRequest, TrainerVerificationResponse } from '../../dto/trainer/trainerDTO.js';
export interface IUpdateTrainers {
  updateTrainerProfile(
    data:SubmitTrainerVerificationRequest
  ): Promise<TrainerVerificationResponse>; 
}
