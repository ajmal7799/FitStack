import { VerificationDTO } from '../../../dto/verification/verificationDTO';
export interface IGetAllTrainerUseCase {
    getAllTrainer(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number }>;
}