import { IUserRepository } from '../../../../domain/interfaces/repositories/IUserRepository';
import { IHashedPasswordServices } from '../../../../domain/interfaces/services/IHashPasswordServices';
import { Errors, USER_ERRORS } from '../../../../shared/constants/error';
import { LoginUserDTO } from '../../../dto/auth/LoginUserDTO';
import { UserMapper } from '../../../mappers/userMappers';
import { IUserLoginUseCase } from '../../../useCase/auth/user/IUserLoginUseCase';
import { UserRole, UserStatus } from '../../../../domain/enum/userEnums';
import { ITrainerRepository } from '../../../../domain/interfaces/repositories/ITrainerRepository';
import {
    InvalidDataException,
    IsBlockedExecption,
    NotFoundException,
    PasswordNotMatchingException,
} from '../../../constants/exceptions';

export class UserLoginUseCase implements IUserLoginUseCase {
    private _userRepository;
    private _hashService;
    private _trainerRepository;

    constructor(
        userRepository: IUserRepository,
        hashService: IHashedPasswordServices,
        trainerRepository: ITrainerRepository,
    ) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._trainerRepository = trainerRepository;
    }

    async userLogin(email: string, password: string): Promise<LoginUserDTO> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        if (user.isActive === UserStatus.BLOCKED) {
            throw new IsBlockedExecption(USER_ERRORS.USER_BLOCKED);
        }

        const verifyPassword = await this._hashService.comparePassword(password, user.password!);

        if (!verifyPassword) {
            throw new PasswordNotMatchingException(Errors.INVALID_CREDENTIALS);
        }

        let verificationCheck: boolean = true;
   
        if (user.role === UserRole.TRAINER) {
            const trainer = await this._trainerRepository.findByTrainerId(user._id!);
            if (!trainer) {
                verificationCheck = false;
            } else if (trainer.isVerified) {
                verificationCheck = true;
            } else {
                verificationCheck = false;
            }
        }

        const response: LoginUserDTO = UserMapper.toLoginUserResponse(user,verificationCheck);
        return response;    
    }
}
