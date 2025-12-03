import { IVerificationRejectUseCase } from "../../../useCase/admin/verification/IVerificationRejectUseCase";
import { NotFoundException } from "../../../constants/exceptions";
import { TRAINER_ERRORS } from "../../../../shared/constants/error";
import { IUpdateVerification } from "../../../../domain/interfaces/repositories/IVerificationRepository";
import { VerificationRejectResponseDTO } from "../../../dto/verification/verificationRejectDTO";


export class VerificationRejectUseCase implements IVerificationRejectUseCase {
    constructor(
        private _verificationRepository: IUpdateVerification
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

        return {
            id: trainerReject.id,
            verificationStatus: trainerReject.verificationStatus,
            rejectionReason: trainerReject.rejectionReason || ""
        }

    }
}