import { IUpdateVerification } from "../../../../domain/interfaces/repositories/IVerificationRepository";
import { IVerificationApproveUseCase } from "../../../useCase/admin/verification/IVerificationApproveUseCase";
import { NotFoundException } from "../../../constants/exceptions";
import { TRAINER_ERRORS } from "../../../../shared/constants/error";
import { VerificationApproveResponseDTO } from "../../../dto/verification/verificationApproveDTO";

export class VerificationApproveUseCase implements IVerificationApproveUseCase {
    constructor(
        private _verificationRepository: IUpdateVerification,
        
    ) { }
    async execute(trainerId: string): Promise<VerificationApproveResponseDTO> {

        const verification = await this._verificationRepository.findByTrainerId(trainerId);

        if (!verification) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }

       let trainerVerification = await this._verificationRepository.verifyTrainer(trainerId);

        if (!trainerVerification) {
            throw new NotFoundException(TRAINER_ERRORS.TRAINER_VERIFICATION_NOT_FOUND);
        }

        return {
            id: trainerVerification.id,
            verificationStatus: trainerVerification.verificationStatus
        }
        
    }
}