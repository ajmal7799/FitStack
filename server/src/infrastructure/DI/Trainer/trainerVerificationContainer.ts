import { TrainerVerificationController } from '../../../interfaceAdapters/controller/trainer/trainerVerificationController';
import { UpdateTrainer } from '../../../application/implementation/trainer/updateTrainer';
import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { StorageService } from '../../services/Storage/storageService';
import { TrainerRepository } from '../../repositories/trainerRepository';
import { trainerModel } from '../../database/models/trainerModel';
import { VerificationRepository } from '../../repositories/verificationRepository';
import { verificationModel } from '../../database/models/verificationModel';
import { GetProfileData } from '../../../application/implementation/trainer/getProfileData';
import { GetVerificationData } from '../../../application/implementation/trainer/getVerificationData';

//Repository & Service
const userRepository = new UserRepository(userModel); 
const storageSvc = new StorageService();
const trainerRepository = new TrainerRepository(trainerModel);
const verificationRepository = new VerificationRepository(verificationModel);


//UseCase
const updateTrainerUseCase = new UpdateTrainer(
    userRepository,
    storageSvc,
    trainerRepository,
    verificationRepository,
);


const getProfileData = new GetProfileData(
    userRepository,
    trainerRepository,
    verificationRepository,
);

const getVerificationData = new GetVerificationData(
    userRepository,
    verificationRepository,
    storageSvc
);


//controller
export const trainerVerificationController = new TrainerVerificationController(updateTrainerUseCase, getProfileData,getVerificationData);