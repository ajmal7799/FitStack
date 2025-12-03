import { VerificationDTO } from '../../../dto/verification/verificationDTO';
export interface IGetAllVerificationUseCase {
  getAllVerification(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number }>;
}
