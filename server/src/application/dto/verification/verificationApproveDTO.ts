import { VerificationStatus } from '../../../domain/enum/verificationStatus';

export interface VerificationApproveResponseDTO {
    id: string;
    verificationStatus: VerificationStatus;
}