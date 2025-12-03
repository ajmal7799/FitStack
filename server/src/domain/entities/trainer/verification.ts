import { VerificationStatus } from '../../enum/verificationStatus';

export interface TrainerVerification {
        id: string;
        trainerId: string; 

        idCard: string;
        educationCert: string;
        experienceCert: string; 

        verificationStatus: VerificationStatus;
        rejectionReason?: string;
        submittedAt: Date;    
    }