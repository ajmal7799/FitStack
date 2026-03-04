import { IGetAllUsersUseCase } from '../../../useCase/admin/user/IGetAllUsersUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { UserDTO } from '../../../dto/user/userDTO';
import { UserMapper } from '../../../mappers/userMappers';
import { IStorageService } from '../../../../domain/interfaces/services/IStorage/IStorageService';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService,
    ) {}

    async getAllUser(
        page: number,
        limit: number,
        status?: string,
        search?: string,
    ): Promise<{ users: UserDTO[]; totalUsers: number; totalPages: number; currentPage: number }> {
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            this._userRepository.findAllUsers(skip, limit, status, search),
            this._userRepository.countUsers(status, search),
        ]);

        const userDTOs = await Promise.all(
            users.map(async user => {
                const dto = UserMapper.toDTO(user);

                // ✅ Get presigned profile image URL
                if (user.profileImage) {
                    dto.profileImage = await this._storageService.createSignedUrl(user.profileImage, 10 * 60);
                }

                return dto;
            }),
        );

        return {
            users: userDTOs,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        };
    }
}
