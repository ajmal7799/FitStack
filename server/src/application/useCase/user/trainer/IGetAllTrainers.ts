import { VerificationDTO } from '../../../dto/verification/verificationDTO';
export interface IGetAllTrainerUseCase {
    getAllTrainer(
    page: number,
    limit: number,
    search?: string,
    userId?: string,
  ): Promise<{ verifications: VerificationDTO[]; totalVerifications: number; totalPages: number; currentPage: number, hasActiveSubscription: boolean }>;
}