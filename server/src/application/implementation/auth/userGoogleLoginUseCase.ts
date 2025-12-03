import { UserRole } from "../../../domain/enum/userEnums";
import { UserStatus } from "../../../domain/enum/userEnums";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import { IGoogleLoginUseCase } from "../../useCase/auth/IGoogleLoginUseCase";
import { IGoogleLoginRequestDTO,IGoogleLoginResponseDTO } from "../../dto/auth/googleAuthDTO";
import { UserMapper } from "../../mappers/userMappers";
import { any } from "zod";

export class UserGoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        private _googleAuthService: IGoogleAuthService,
        private _userRepository: IUserRepository
    ) {}

    async execute({authorizationCode, role}: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
        const { email, googleId, name} = await this._googleAuthService.authorize(authorizationCode);

        let user  = await this._userRepository.findByEmail(email);

        if(!user) {
            user = {
            email,
            name,
            role:UserRole.USER,
            isActive: UserStatus.ACTIVE,
            googleId,
           
        }
        const id = await this._userRepository.googleSignUp(user);
        user._id = id;
        }
        return UserMapper.toLoginUserResponse(user);
    }

}