import { IVerificationRejectUseCase } from '../../../useCase/admin/verification/IVerificationRejectUseCase';
import { NotFoundException } from '../../../constants/exceptions';
import { TRAINER_ERRORS } from '../../../../shared/constants/error';
import { IUpdateVerification } from '../../../../domain/interfaces/repositories/IVerificationRepository';
import { VerificationRejectResponseDTO } from '../../../dto/verification/verificationRejectDTO';
import { CreateNotification } from '../../notification/CreateNotification';
import { NotificationType } from '../../../../domain/enum/NotificationEnums';
import { UserRole } from '../../../../domain/enum/userEnums';


export class VerificationRejectUseCase implements IVerificationRejectUseCase {
    constructor(
        private _verificationRepository: IUpdateVerification,
        private _createNotification: CreateNotification
    ) {}

    async execute(id: string, reason: string): Promise<VerificationRejectResponseDTO> {
        const verification = await this._verificationRepository.findByTrainerId(id);

        if (!verification) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }

        const trainerReject = await this._verificationRepository.rejectTrainer(id, reason);

        if (!trainerReject) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }

        await this._createNotification.execute({
            recipientId: id,
            recipientRole: UserRole.TRAINER,
            type: NotificationType.VERIFICATION_REJECTED,
            title: "Verification Rejected",
            message: `Your verification was rejected. Reason: ${reason}`,
            isRead: false
        });

        return {
            id: trainerReject.id,
            verificationStatus: trainerReject.verificationStatus,
            rejectionReason: trainerReject.rejectionReason || '',
        };

    }
}