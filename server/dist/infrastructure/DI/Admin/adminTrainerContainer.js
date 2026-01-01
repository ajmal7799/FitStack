"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTrainerController = void 0;
const userModel_1 = require("../../database/models/userModel");
const userRepository_1 = require("../../repositories/userRepository");
const getAllTrainerUseCase_1 = require("../../../application/implementation/admin/trainer/getAllTrainerUseCase");
const adminTrainerController_1 = require("../../../interfaceAdapters/controller/admin/adminTrainerController");
const updateTrainerUseCase_1 = require("../../../application/implementation/admin/trainer/updateTrainerUseCase");
//Repository & Service
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
//UseCase
const getAllTrainerUseCase = new getAllTrainerUseCase_1.GetAllTrainerUseCase(userRepository);
const updateTrainerStatus = new updateTrainerUseCase_1.UpdateTrainerStatusUseCase(userRepository);
//controller
exports.adminTrainerController = new adminTrainerController_1.AdminTrainerController(getAllTrainerUseCase, updateTrainerStatus);
