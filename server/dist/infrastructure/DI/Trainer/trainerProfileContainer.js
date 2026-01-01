"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerProfileController = void 0;
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const getProfileData_1 = require("../../../application/implementation/trainer/profile/getProfileData");
const trainerProfileController_1 = require("../../../interfaceAdapters/controller/trainer/trainerProfileController");
const trainerRepository_1 = require("../../repositories/trainerRepository");
const trainerModel_1 = require("../../database/models/trainerModel");
const verificationRepository_1 = require("../../repositories/verificationRepository");
const verificationModel_1 = require("../../database/models/verificationModel");
const updateProfileUseCase_1 = require("../../../application/implementation/trainer/profile/updateProfileUseCase");
const storageService_1 = require("../../services/Storage/storageService");
// Repository & Service
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const trainerRepository = new trainerRepository_1.TrainerRepository(trainerModel_1.trainerModel);
const verificationRepository = new verificationRepository_1.VerificationRepository(verificationModel_1.verificationModel);
const storageSvc = new storageService_1.StorageService();
//UseCase
const getProfileData = new getProfileData_1.GetProfileData(userRepository, trainerRepository, verificationRepository, storageSvc);
const updateProfile = new updateProfileUseCase_1.UpdateTrainerProfileUseCase(userRepository, trainerRepository, storageSvc);
// controller
exports.trainerProfileController = new trainerProfileController_1.TrainerProfileController(getProfileData, updateProfile);
