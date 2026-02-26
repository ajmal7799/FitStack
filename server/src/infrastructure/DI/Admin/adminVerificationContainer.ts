import { AdminVerificationController } from '../../../interfaceAdapters/controller/admin/adminVerificationController';
import { GetAllVerificationUseCase } from '../../../application/implementation/admin/verification/getAllVerificationUseCase';
import { VerificationRepository } from '../../repositories/verificationRepository';
import { verificationModel } from '../../database/models/verificationModel';
import { GetVerificationDetailsUseCase } from '../../../application/implementation/admin/verification/getVerificationDetailsUseCase';
import { StorageService } from '../../services/Storage/storageService';
import { VerificationApproveUseCase } from '../../../application/implementation/admin/verification/verificationApproveUseCase';
import { VerificationRejectUseCase } from '../../../application/implementation/admin/verification/verificationRejectUseCase';
import { CreateNotification } from '../../../application/implementation/notification/CreateNotification';
import { NotificationRepository } from '../../repositories/notificationRepository';
import { notificationModel } from '../../database/models/notificationModel';

//Repository & Service
const verificationRepository = new VerificationRepository(verificationModel);
const storageSvc = new StorageService();
const notificationRepository = new NotificationRepository(notificationModel);
const createNotification = new CreateNotification(notificationRepository);

//UseCase
const getAllVerificationUseCase = new GetAllVerificationUseCase(verificationRepository);
const getVerificationDetailsUseCase = new GetVerificationDetailsUseCase(verificationRepository, storageSvc);
const verificationApproveUseCase = new VerificationApproveUseCase(verificationRepository, createNotification);
const verificationRejectUseCase = new VerificationRejectUseCase(verificationRepository, createNotification);


//Controllers
export const adminVerificationController = new AdminVerificationController(
    getAllVerificationUseCase,
    getVerificationDetailsUseCase,
    verificationApproveUseCase,
    verificationRejectUseCase,
);