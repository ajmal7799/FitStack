import { VerificationStatus } from '../../../../domain/enum/verificationStatus';

export interface TrainerProfileDTO {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    about?: string;
    experience?: number;
    qualification?: string;
    specialisation?: string;
    verificationStatus?: VerificationStatus;
}