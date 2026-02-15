import { UserTrainerController } from '../../../../interfaceAdapters/controller/user/userTrainerController';
import { VerificationRepository } from '../../../repositories/verificationRepository';
import { GetAllTrainerUseCase } from '../../../../application/implementation/user/Trainer/GetAllTrainerUseCase';
import { verificationModel } from '../../../database/models/verificationModel';
import { StorageService } from '../../../services/Storage/storageService';
import { GetTrainerDetailsUseCase } from '../../../../application/implementation/user/Trainer/GetTrainerDetailsUseCase';
import { userModel } from '../../../database/models/userModel';
import { UserRepository } from '../../../repositories/userRepository';
import { TrainerRepository } from '../../../repositories/trainerRepository';
import { trainerModel } from '../../../database/models/trainerModel';
import { TrainerSelectRepository } from '../../../repositories/trainerSelectRepository';
import { trainerSelectModel } from '../../../database/models/trainerSelectModel';
import { TrainerSelectUseCase } from '../../../../application/implementation/user/Trainer/TrainerSelectUseCase';
import { GetSelectedTrainerUseCase } from '../../../../application/implementation/user/Trainer/GetSelectedTrainerUseCase';
//repositories & services
const verificationRepository = new VerificationRepository(verificationModel);
const storageService = new StorageService(); // Initialize your storage service here if needed
const userRepository = new UserRepository(userModel);
const trainerRepository = new TrainerRepository(trainerModel);
const trainerSelectRepository = new TrainerSelectRepository(trainerSelectModel);

// useCases
const getAllTrainerUseCase = new GetAllTrainerUseCase(verificationRepository, storageService, userRepository);
const getTrainerDetailsUseCase = new GetTrainerDetailsUseCase(trainerRepository, userRepository, storageService);
const selectTrainer = new TrainerSelectUseCase(trainerSelectRepository, userRepository);
const getSelectedTrainer = new GetSelectedTrainerUseCase(
    trainerSelectRepository,
    userRepository,
    storageService,
    trainerRepository,
);

// controllers
export const userTrainerController = new UserTrainerController(
    getAllTrainerUseCase,
    getTrainerDetailsUseCase,
    selectTrainer,
    getSelectedTrainer,
);
