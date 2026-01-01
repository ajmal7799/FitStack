import { VerificationStatus } from '../../../domain/enum/verificationStatus';

export interface VerificationDetailDTO {
    trainerId: string;
    name: string;
    email: string;
    phone: string;
    about: string;
    experience: number;
    qualification: string;
    specialisation: string;
    idCard: string;
    educationCert: string;
    experienceCert: string;
    verificationStatus: VerificationStatus;
    rejectionReason?: string;
}