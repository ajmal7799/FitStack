"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTrainerController = void 0;
const userTrainerController_1 = require("../../../../interfaceAdapters/controller/user/userTrainerController");
const verificationRepository_1 = require("../../../repositories/verificationRepository");
const GetAllTrainerUseCase_1 = require("../../../../application/implementation/user/Trainer/GetAllTrainerUseCase");
const verificationModel_1 = require("../../../database/models/verificationModel");
const storageService_1 = require("../../../services/Storage/storageService");
const GetTrainerDetailsUseCase_1 = require("../../../../application/implementation/user/Trainer/GetTrainerDetailsUseCase");
const userModel_1 = require("../../../database/models/userModel");
const userRepository_1 = require("../../../repositories/userRepository");
const trainerRepository_1 = require("../../../repositories/trainerRepository");
const trainerModel_1 = require("../../../database/models/trainerModel");
const trainerSelectRepository_1 = require("../../../repositories/trainerSelectRepository");
const trainerSelectModel_1 = require("../../../database/models/trainerSelectModel");
const TrainerSelectUseCase_1 = require("../../../../application/implementation/user/Trainer/TrainerSelectUseCase");
const GetSelectedTrainerUseCase_1 = require("../../../../application/implementation/user/Trainer/GetSelectedTrainerUseCase");
//repositories & services
const verificationRepository = new verificationRepository_1.VerificationRepository(verificationModel_1.verificationModel);
const storageService = new storageService_1.StorageService(); // Initialize your storage service here if needed
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const trainerRepository = new trainerRepository_1.TrainerRepository(trainerModel_1.trainerModel);
const trainerSelectRepository = new trainerSelectRepository_1.TrainerSelectRepository(trainerSelectModel_1.trainerSelectModel);
// useCases
const getAllTrainerUseCase = new GetAllTrainerUseCase_1.GetAllTrainerUseCase(verificationRepository, storageService);
const getTrainerDetailsUseCase = new GetTrainerDetailsUseCase_1.GetTrainerDetailsUseCase(trainerRepository, userRepository, storageService);
const selectTrainer = new TrainerSelectUseCase_1.TrainerSelectUseCase(trainerSelectRepository, userRepository);
const getSelectedTrainer = new GetSelectedTrainerUseCase_1.GetSelectedTrainerUseCase(trainerSelectRepository, userRepository, storageService, trainerRepository);
// controllers
exports.userTrainerController = new userTrainerController_1.UserTrainerController(getAllTrainerUseCase, getTrainerDetailsUseCase, selectTrainer, getSelectedTrainer);
