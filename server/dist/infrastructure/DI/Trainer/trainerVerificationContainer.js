"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerVerificationController = void 0;
const trainerVerificationController_1 = require("../../../interfaceAdapters/controller/trainer/trainerVerificationController");
const updateTrainer_1 = require("../../../application/implementation/trainer/updateTrainer");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const storageService_1 = require("../../services/Storage/storageService");
const trainerRepository_1 = require("../../repositories/trainerRepository");
const trainerModel_1 = require("../../database/models/trainerModel");
const verificationRepository_1 = require("../../repositories/verificationRepository");
const verificationModel_1 = require("../../database/models/verificationModel");
const getVerificationData_1 = require("../../../application/implementation/trainer/getVerificationData");
//Repository & Service
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const storageSvc = new storageService_1.StorageService();
const trainerRepository = new trainerRepository_1.TrainerRepository(trainerModel_1.trainerModel);
const verificationRepository = new verificationRepository_1.VerificationRepository(verificationModel_1.verificationModel);
//UseCase
const updateTrainerUseCase = new updateTrainer_1.UpdateTrainer(userRepository, storageSvc, trainerRepository, verificationRepository);
// const getProfileData = new GetProfileData(
//     userRepository,
//     trainerRepository,
//     verificationRepository,
// );
const getVerificationData = new getVerificationData_1.GetVerificationData(userRepository, verificationRepository, storageSvc);
//controller
exports.trainerVerificationController = new trainerVerificationController_1.TrainerVerificationController(updateTrainerUseCase, getVerificationData);
