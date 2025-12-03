import { UserRole } from '../../../../domain/enum/userEnums';
import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IHashedPasswordServices } from '../../../../domain/interfaces/services/IHashPasswordServices';
import { Errors, USER_ERRORS,ADMIN_ERRORS } from '../../../../shared/constants/error';
import { LoginAdminResponseDTO } from '../../../dto/auth/LoginAdminDTO';
import { UserMapper } from '../../../mappers/userMappers';
import { IAdminLoginUseCase } from '../../../useCase/auth/admin/IAdminLoginUseCase';
import {
    InvalidDataException,
    NotFoundException,

} from '../../../constants/exceptions';
 
 
export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(private _userRepository: IUserRepository, private _hashService: IHashedPasswordServices) { }

    async adminLogin(email: string, password: string): Promise<LoginAdminResponseDTO> {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        if (user.role !== UserRole.ADMIN) {
            throw new InvalidDataException(ADMIN_ERRORS.ADMIN_SIGNUP_NOT_ALLOWED);
        }

        const verifyPassword = await this._hashService.comparePassword(password, user.password!);

        if (!verifyPassword) {
            throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
        }

        const response: LoginAdminResponseDTO = UserMapper.toLoginAdminResponse(user);
        return response; 
    }
} 
