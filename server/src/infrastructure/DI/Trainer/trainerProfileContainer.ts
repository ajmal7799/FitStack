import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { GetProfileData } from '../../../application/implementation/trainer/profile/getProfileData';
import { TrainerProfileController } from '../../../interfaceAdapters/controller/trainer/trainerProfileController';
import { TrainerRepository } from '../../repositories/trainerRepository';
import { trainerModel } from '../../database/models/trainerModel';
import { VerificationRepository } from '../../repositories/verificationRepository';
import { verificationModel } from '../../database/models/verificationModel';
import { UpdateTrainerProfileUseCase } from '../../../application/implementation/trainer/profile/updateProfileUseCase';
import { StorageService } from '../../services/Storage/storageService';

// Repository & Service
const userRepository = new UserRepository(userModel); 
const trainerRepository = new TrainerRepository(trainerModel);
const verificationRepository = new VerificationRepository(verificationModel);
const storageSvc = new StorageService();


//UseCase
const getProfileData = new GetProfileData(
    userRepository,
    trainerRepository,
    verificationRepository,
    storageSvc,
);

const updateProfile = new UpdateTrainerProfileUseCase(userRepository, trainerRepository,storageSvc);



// controller
export const trainerProfileController = new TrainerProfileController(getProfileData, updateProfile);