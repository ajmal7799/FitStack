import { UserDTO } from '../../../dto/user/userDTO';

export interface IGetAllTrainerUseCase {
  getAllTrainer(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }>;
}