"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTrainerController = void 0;
const userModel_1 = require("../../database/models/userModel");
const userRepository_1 = require("../../repositories/userRepository");
const getAllTrainerUseCase_1 = require("../../../application/implementation/admin/trainer/getAllTrainerUseCase");
const adminTrainerController_1 = require("../../../interfaceAdapters/controller/admin/adminTrainerController");
const updateTrainerUseCase_1 = require("../../../application/implementation/admin/trainer/updateTrainerUseCase");
const trainerRepository_1 = require("../../repositories/trainerRepository");
const trainerModel_1 = require("../../database/models/trainerModel");
const storageService_1 = require("../../services/Storage/storageService");
const getTrainerDetailsUseCase_1 = require("../../../application/implementation/admin/trainer/getTrainerDetailsUseCase");
const walletRepository_1 = require("../../repositories/walletRepository");
const walletModel_1 = require("../../database/models/walletModel");
const trainerSelectRepository_1 = require("../../repositories/trainerSelectRepository");
const trainerSelectModel_1 = require("../../database/models/trainerSelectModel");
//Repository & Service
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const trainerRepository = new trainerRepository_1.TrainerRepository(trainerModel_1.trainerModel);
const storageSvc = new storageService_1.StorageService();
const walletRepository = new walletRepository_1.WalletRepository(walletModel_1.walletModel);
const trainerSelectRepository = new trainerSelectRepository_1.TrainerSelectRepository(trainerSelectModel_1.trainerSelectModel);
//UseCase
const getAllTrainerUseCase = new getAllTrainerUseCase_1.GetAllTrainerUseCase(userRepository, storageSvc, trainerRepository);
const updateTrainerStatus = new updateTrainerUseCase_1.UpdateTrainerStatusUseCase(userRepository);
const getTrainerDetailsUseCase = new getTrainerDetailsUseCase_1.GetTrainerDetailsUseCase(trainerRepository, userRepository, walletRepository, storageSvc, trainerSelectRepository);
//controller
exports.adminTrainerController = new adminTrainerController_1.AdminTrainerController(getAllTrainerUseCase, updateTrainerStatus, getTrainerDetailsUseCase);
