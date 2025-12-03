import { VerificationStatus } from "../../../domain/enum/verificationStatus";

export interface VerificationDTO {
    trainerId: string;
    name: string;
    email: string;
    qualification: string;
    verificationStatus: VerificationStatus;
}