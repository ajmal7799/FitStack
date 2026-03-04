"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerDashboardController = void 0;
// infrastructure/DI/trainer/trainerDashboardContainer.ts
const trainerDashboardController_1 = require("../../../interfaceAdapters/controller/trainer/trainerDashboardController");
const GetTrainerDashboardUseCase_1 = require("../../../application/implementation/trainer/dashboard/GetTrainerDashboardUseCase");
const trainerDashboardRepository_1 = require("../../repositories/trainerDashboardRepository");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const walletModel_1 = require("../../database/models/walletModel");
const feedbackModel_1 = require("../../database/models/feedbackModel");
const trainerSelectModel_1 = require("../../database/models/trainerSelectModel");
const userModel_1 = require("../../database/models/userModel");
const trainerDashboardRepository = new trainerDashboardRepository_1.TrainerDashboardRepository(videoCallModel_1.videoCallModel, walletModel_1.walletModel, feedbackModel_1.feedbackModel, trainerSelectModel_1.trainerSelectModel, userModel_1.userModel);
const getTrainerDashboardUseCase = new GetTrainerDashboardUseCase_1.GetTrainerDashboardUseCase(trainerDashboardRepository);
exports.trainerDashboardController = new trainerDashboardController_1.TrainerDashboardController(getTrainerDashboardUseCase);
