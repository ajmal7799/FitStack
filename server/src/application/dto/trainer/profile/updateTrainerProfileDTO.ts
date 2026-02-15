import { User } from '../../../../domain/entities/user/userEntities';
import { Trainer } from '../../../../domain/entities/trainer/trainerEntities';
export interface UpdateTrainerProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  qualification?: string;
  specialisation?: string;
  experience?: number;
  about?: string;
}


export interface UpdateTrainerProfileResponseDTO {
    user: User
    trainer: Trainer
}