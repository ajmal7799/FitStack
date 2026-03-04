"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVerificationController = void 0;
const adminVerificationController_1 = require("../../../interfaceAdapters/controller/admin/adminVerificationController");
const getAllVerificationUseCase_1 = require("../../../application/implementation/admin/verification/getAllVerificationUseCase");
const verificationRepository_1 = require("../../repositories/verificationRepository");
const verificationModel_1 = require("../../database/models/verificationModel");
const getVerificationDetailsUseCase_1 = require("../../../application/implementation/admin/verification/getVerificationDetailsUseCase");
const storageService_1 = require("../../services/Storage/storageService");
const verificationApproveUseCase_1 = require("../../../application/implementation/admin/verification/verificationApproveUseCase");
const verificationRejectUseCase_1 = require("../../../application/implementation/admin/verification/verificationRejectUseCase");
const CreateNotification_1 = require("../../../application/implementation/notification/CreateNotification");
const notificationRepository_1 = require("../../repositories/notificationRepository");
const notificationModel_1 = require("../../database/models/notificationModel");
//Repository & Service
const verificationRepository = new verificationRepository_1.VerificationRepository(verificationModel_1.verificationModel);
const storageSvc = new storageService_1.StorageService();
const notificationRepository = new notificationRepository_1.NotificationRepository(notificationModel_1.notificationModel);
const createNotification = new CreateNotification_1.CreateNotification(notificationRepository);
//UseCase
const getAllVerificationUseCase = new getAllVerificationUseCase_1.GetAllVerificationUseCase(verificationRepository, storageSvc);
const getVerificationDetailsUseCase = new getVerificationDetailsUseCase_1.GetVerificationDetailsUseCase(verificationRepository, storageSvc);
const verificationApproveUseCase = new verificationApproveUseCase_1.VerificationApproveUseCase(verificationRepository, createNotification);
const verificationRejectUseCase = new verificationRejectUseCase_1.VerificationRejectUseCase(verificationRepository, createNotification);
//Controllers
exports.adminVerificationController = new adminVerificationController_1.AdminVerificationController(getAllVerificationUseCase, getVerificationDetailsUseCase, verificationApproveUseCase, verificationRejectUseCase);
