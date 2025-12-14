import { TrainerVerification } from '../../entities/trainer/verification';
import { User } from '../../entities/user/userEntities';
import { Trainer } from '../../entities/trainer/trainerEntities';


export interface IUpdateVerification  {
    findByTrainerId(trainerId: string) : Promise<TrainerVerification| null>;
    updateTrainerVerification(trainerId: string, data: Partial<TrainerVerification>): Promise<TrainerVerification| null>;
    findAllVerification(skip?: number, limit?: number, status?: string, search?: string): Promise<{verification:TrainerVerification,trainer:Trainer,user:User}[]>
    countVerifications(status?: string, search?: string): Promise<number>
    findVerificationByTrainerId(trainerId: string): Promise<{verification:TrainerVerification,trainer:Trainer,user:User} >;
    verifyTrainer(trainerId: string): Promise<TrainerVerification| null>;
    rejectTrainer(trainerId: string, rejectionReason: string): Promise<TrainerVerification| null>;
    allVerifiedTrainer(skip?: number, limit?: number, search?: string): Promise<{trainer: Trainer, verification: TrainerVerification, user: User}[]>
    countVerifiedTrainer(search?: string): Promise<number>
}