"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSessionController = void 0;
const adminSessionController_1 = require("../../../interfaceAdapters/controller/admin/adminSessionController");
const SessionHistoryUseCase_1 = require("../../../application/implementation/admin/session/SessionHistoryUseCase");
const videoCallRepository_1 = require("../../repositories/videoCallRepository");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const SessionAdminHistoryUseCase_1 = require("../../../application/implementation/admin/session/SessionAdminHistoryUseCase");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const storageService_1 = require("../../services/Storage/storageService");
const feedbackRepository_1 = require("../../repositories/feedbackRepository");
const feedbackModel_1 = require("../../database/models/feedbackModel");
// repositories & services
const videoCallRepository = new videoCallRepository_1.VideoCallRepository(videoCallModel_1.videoCallModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const storageService = new storageService_1.StorageService();
const feedbackRepository = new feedbackRepository_1.FeedbackRepository(feedbackModel_1.feedbackModel);
// use cases
const sessionHistoryUseCase = new SessionHistoryUseCase_1.SessionHistoryUseCase(videoCallRepository, feedbackRepository);
const sessionAdminHistoryUseCase = new SessionAdminHistoryUseCase_1.SessionAdminHistoryUseCase(videoCallRepository, userRepository, storageService, feedbackRepository);
// controllers
exports.adminSessionController = new adminSessionController_1.AdminSessionController(sessionHistoryUseCase, sessionAdminHistoryUseCase);
