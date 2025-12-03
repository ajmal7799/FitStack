import { VerificationDetailDTO } from "../../../dto/verification/verificationDetailsDTO";
export interface IGetVerificationDetailsPage {
    execute(trainerId: string): Promise<VerificationDetailDTO>;
}