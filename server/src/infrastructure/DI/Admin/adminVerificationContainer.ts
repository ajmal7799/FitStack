import { AdminVerificationController } from '../../../interfaceAdapters/controller/admin/adminVerificationController';
import { GetAllVerificationUseCase } from '../../../application/implementation/admin/verification/getAllVerificationUseCase';
import { VerificationRepository } from '../../repositories/verificationRepository';
import { verificationModel } from '../../database/models/verificationModel';
import { GetVerificationDetailsUseCase } from '../../../application/implementation/admin/verification/getVerificationDetailsUseCase';
import { StorageService } from '../../services/Storage/storageService';
import { VerificationApproveUseCase } from '../../../application/implementation/admin/verification/verificationApproveUseCase';
import { VerificationRejectUseCase } from '../../../application/implementation/admin/verification/verificationRejectUseCase';

//Repository & Service
const verificationRepository = new VerificationRepository(verificationModel);
const storageSvc = new StorageService();

//UseCase
const getAllVerificationUseCase = new GetAllVerificationUseCase(verificationRepository);
const getVerificationDetailsUseCase = new GetVerificationDetailsUseCase(verificationRepository, storageSvc);
const verificationApproveUseCase = new VerificationApproveUseCase(verificationRepository);
const verificationRejectUseCase = new VerificationRejectUseCase(verificationRepository);


//Controllers
export const adminVerificationController = new AdminVerificationController(
    getAllVerificationUseCase,
    getVerificationDetailsUseCase,
    verificationApproveUseCase,
    verificationRejectUseCase,
);