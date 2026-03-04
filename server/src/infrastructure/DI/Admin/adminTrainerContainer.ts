import { userModel } from '../../database/models/userModel';
import { UserRepository } from '../../repositories/userRepository';
import { GetAllTrainerUseCase } from '../../../application/implementation/admin/trainer/getAllTrainerUseCase';
import { AdminTrainerController } from '../../../interfaceAdapters/controller/admin/adminTrainerController';
import { UpdateTrainerStatusUseCase } from '../../../application/implementation/admin/trainer/updateTrainerUseCase';
import { TrainerRepository } from '../../repositories/trainerRepository';
import { trainerModel } from '../../database/models/trainerModel';
import { StorageService } from '../../services/Storage/storageService';
import { GetTrainerDetailsUseCase } from '../../../application/implementation/admin/trainer/getTrainerDetailsUseCase';
import { WalletRepository } from '../../repositories/walletRepository';
import { walletModel } from '../../database/models/walletModel';
import { TrainerSelectRepository } from '../../repositories/trainerSelectRepository';
import { trainerSelectModel } from '../../database/models/trainerSelectModel';

//Repository & Service
const userRepository = new UserRepository(userModel);
const trainerRepository = new TrainerRepository(trainerModel);
const storageSvc = new StorageService();
const walletRepository = new WalletRepository(walletModel);
const trainerSelectRepository = new TrainerSelectRepository(trainerSelectModel);


//UseCase
const getAllTrainerUseCase = new GetAllTrainerUseCase(userRepository, storageSvc, trainerRepository);
const updateTrainerStatus = new UpdateTrainerStatusUseCase(userRepository);
const getTrainerDetailsUseCase = new GetTrainerDetailsUseCase(trainerRepository, userRepository,walletRepository, storageSvc, trainerSelectRepository);

//controller
export const adminTrainerController = new AdminTrainerController(getAllTrainerUseCase,updateTrainerStatus, getTrainerDetailsUseCase);