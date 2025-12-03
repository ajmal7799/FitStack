import { VerificationStatus } from '../../../domain/enum/verificationStatus';

export interface TrainerProfileDTO {
    name?: string;
    email?: string;
    phone?: string;
    about?: string;
    experience?: number;
    qualification?: string;
    specialisation?: string;
    verificationStatus?: VerificationStatus;
}