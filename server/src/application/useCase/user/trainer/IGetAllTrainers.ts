import { VerificationDTO } from '../../../dto/verification/verificationDTO';
export interface IGetAllTrainerUseCase {
    getAllTrainer(
    page: number,
    limit: number,
  ): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number }>;
}