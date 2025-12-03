import { VerificationRejectResponseDTO } from "../../../dto/verification/verificationRejectDTO";

export interface IVerificationRejectUseCase {
    execute(id: string, reason: string): Promise<VerificationRejectResponseDTO>;
}