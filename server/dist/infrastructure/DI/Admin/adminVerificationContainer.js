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
//Repository & Service
const verificationRepository = new verificationRepository_1.VerificationRepository(verificationModel_1.verificationModel);
const storageSvc = new storageService_1.StorageService();
//UseCase
const getAllVerificationUseCase = new getAllVerificationUseCase_1.GetAllVerificationUseCase(verificationRepository);
const getVerificationDetailsUseCase = new getVerificationDetailsUseCase_1.GetVerificationDetailsUseCase(verificationRepository, storageSvc);
const verificationApproveUseCase = new verificationApproveUseCase_1.VerificationApproveUseCase(verificationRepository);
const verificationRejectUseCase = new verificationRejectUseCase_1.VerificationRejectUseCase(verificationRepository);
//Controllers
exports.adminVerificationController = new adminVerificationController_1.AdminVerificationController(getAllVerificationUseCase, getVerificationDetailsUseCase, verificationApproveUseCase, verificationRejectUseCase);
