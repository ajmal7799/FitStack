import { VerificationApproveResponseDTO } from "../../../dto/verification/verificationApproveDTO";

export interface IVerificationApproveUseCase {
    execute(trainerId: string): Promise<VerificationApproveResponseDTO>;
}