import { User } from '../../../domain/entities/user/userEntities';
import { UpdateProfileDTO } from '../../dto/user/updateProfileDTO';

export interface IUpdateProfileUseCase {
    updateProfile(userId: string, data: UpdateProfileDTO) : Promise<User>;
}
