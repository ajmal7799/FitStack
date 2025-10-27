import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IHashedPasswordServices } from "../../../../domain/interfaces/services/IHashPasswordServices";
import { Errors, USER_ERRORS } from "../../../../shared/constants/error";
import { LoginUserDTO } from "../../../dto/auth/LoginUserDTO";
import { UserMapper } from "../../../mappers/userMappers";
import { IUserLoginUseCase } from "../../../useCase/auth/user/IUserLoginUseCase";

export class UserLoginUseCase implements IUserLoginUseCase {
    private _userRepository;
    private _hashService;

    constructor(userRepository: IUserRepository, hashService: IHashedPasswordServices) {
        this._userRepository = userRepository
        this._hashService = hashService
    }

    async userLogin(email: string, password: string): Promise<LoginUserDTO> {
        const user = await this._userRepository.findByEmail(email)
        if (!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }

        if (!user.isActive) {
            throw new Error(USER_ERRORS.USER_BLOCKED)
        }

        const verifyPassword = await this._hashService.comparePassword(password,user.password)
        
        if(!verifyPassword) {
            throw new Error(Errors.INVALID_CREDENTIALS)
        }

        const response: LoginUserDTO = UserMapper.toLoginUserResponse(user)
        return response
    }
}