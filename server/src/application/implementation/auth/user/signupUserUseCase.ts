import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IHashedPasswordServices } from "../../../../domain/interfaces/services/IHashPasswordServices";
import { CreateUserDTO } from "../../../dto/auth/createUserDTO";
import { UserMapper } from "../../../mappers/userMappers";
import { User } from "../../../../domain/entities/user/userEntities";
import { USER_ERRORS } from "../../../../shared/constants/error";
import { ICreateUserUseCase } from "../../../useCase/auth/user/ICreateUserUseCase";



export class RegisterUserUseCase implements ICreateUserUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _hashService: IHashedPasswordServices
    ) { }

    async createUser(data: CreateUserDTO): Promise<User> {
        const { email, password } = data;
        const existingUser = await this._userRepository.findByEmail(email)
        if (existingUser) {
            throw new Error(USER_ERRORS.USER_ALREADY_EXISTS)
        }
        const hashedPassword = await this._hashService.hashPassword(password)
        const userEntity = UserMapper.toEntity({
            ...data,
            password: hashedPassword,
        });

        const savedUser = await this._userRepository.save(userEntity)
        return savedUser
    }
}