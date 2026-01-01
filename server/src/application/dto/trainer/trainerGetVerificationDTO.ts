import { VerificationStatus } from '../../../domain/enum/verificationStatus';
export interface TrainerGetVerificationDTO {  
  trainerId: string;
  idCard: string;
  educationCert: string;
  experienceCert: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
}
