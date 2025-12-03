import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { UserDTO } from '../../../dto/user/userDTO';
import { UserMapper } from '../../../mappers/userMappers';
import { IGetAllTrainerUseCase } from '../../../useCase/admin/trainer/IGetAllTrainerUseCase';

export class GetAllTrainerUseCase implements IGetAllTrainerUseCase {
    constructor(private _userRepository: IUserRepository) { }

    async getAllTrainer(page: number, limit: number, status?: string, search?: string): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number; }> {
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            this._userRepository.findAllTrainer(skip, limit, status, search),
            this._userRepository.countTrainer(status, search),
        ]);

        const userDTOs = users.map((user) => UserMapper.toDTO(user));

        return {
            users:userDTOs,
            totalUsers,
            totalPages: Math.ceil(totalUsers/ limit),
            currentPage: page,
        };

    }
    
}