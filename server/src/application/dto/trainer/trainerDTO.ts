import { Trainer } from '../../../domain/entities/trainer/trainerEntities';
import { TrainerVerification } from '../../../domain/entities/trainer/verification';

export interface SubmitTrainerVerificationRequest {
    trainerId: string; 
    
    // 1. Profile Update Data
    qualification: string;
    specialisation: string;
    experience: number;
    about: string;

    // 2. Verification Document Data
    idCard: Express.Multer.File;      
    educationCert: Express.Multer.File;
    experienceCert: Express.Multer.File;
}

export interface TrainerVerificationResponse {
    trainer: Trainer;
    verification: TrainerVerification;
}




