"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDashboardController = void 0;
// infrastructure/DI/Admin/adminDashboardContainer.ts
const adminDashboardController_1 = require("../../../interfaceAdapters/controller/admin/adminDashboardController");
const GetDashboardUseCase_1 = require("../../../application/implementation/admin/dashboard/GetDashboardUseCase");
const dashboardRepository_1 = require("../../repositories/dashboardRepository");
const userModel_1 = require("../../database/models/userModel");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const walletModel_1 = require("../../database/models/walletModel");
const membershipModel_1 = require("../../database/models/membershipModel");
const dashboardRepository = new dashboardRepository_1.DashboardRepository(userModel_1.userModel, videoCallModel_1.videoCallModel, walletModel_1.walletModel, membershipModel_1.membershipModel);
const getDashboardUseCase = new GetDashboardUseCase_1.GetDashboardUseCase(dashboardRepository);
exports.adminDashboardController = new adminDashboardController_1.AdminDashboardController(getDashboardUseCase);
