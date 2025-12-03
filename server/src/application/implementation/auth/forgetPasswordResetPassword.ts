import { IKeyValueTTLCaching } from '../../../domain/interfaces/services/ICache/IKeyValueTTLCaching';
import { IForgetPasswordResetPassword } from '../../useCase/auth/IForgetPasswordResetPassword';
import { ForgetPasswordResetPasswordRequestDTO } from '../../dto/auth/forgetPasswordDTO';
import { Errors } from '../../../shared/constants/error';
import { InvalidDataException, TokenExpiredException } from '../../constants/exceptions';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IHashedPasswordServices } from '../../../domain/interfaces/services/IHashPasswordServices';

export class ForgetPasswordResetPasswordUseCase implements IForgetPasswordResetPassword {
    constructor(
    private _cacheStorage: IKeyValueTTLCaching,
    private _userRepository: IUserRepository,
    private _hashService: IHashedPasswordServices,
    ) {}

    async resetPassword(dto: ForgetPasswordResetPasswordRequestDTO): Promise<void> {
        const cachedToken = await this._cacheStorage.getData(`RTP/${dto.email}`);
    
        if (!cachedToken) {
            throw new TokenExpiredException(Errors.TOKEN_EXPIRED);
        }
        if (cachedToken !== dto.token) {
            throw new InvalidDataException(Errors.INVALID_DATA);
        }

        const hashedPassword = await this._hashService.hashPassword(dto.password);

        await this._userRepository.findByIdAndUpdatePassword(dto.email, hashedPassword);

        await this._cacheStorage.deleteData(`RTP/${dto.email}`);
    }
}
