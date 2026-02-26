import { VerificationStatus } from '../../../domain/enum/verificationStatus';

export interface VerificationDTO {
    trainerId: string;
    name: string;
    email: string;
    specialisation: string;
    verificationStatus: VerificationStatus;
    profileImage?: string;
    averageRating?: number;
    ratingCount?: number;
}