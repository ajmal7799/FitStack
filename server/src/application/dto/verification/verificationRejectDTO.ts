import { VerificationStatus } from '../../../domain/enum/verificationStatus';
export interface VerificationRejectResponseDTO {
    id: string;
    verificationStatus: VerificationStatus;
    rejectionReason: string;
} 