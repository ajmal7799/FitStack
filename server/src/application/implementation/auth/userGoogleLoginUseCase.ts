import { UserRole,  UserStatus } from '../../../domain/enum/userEnums';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IGoogleAuthService } from '../../../domain/interfaces/services/IGoogleAuthService';
import { IGoogleLoginUseCase } from '../../useCase/auth/IGoogleLoginUseCase';
import { IGoogleLoginRequestDTO,IGoogleLoginResponseDTO } from '../../dto/auth/googleAuthDTO';
import { UserMapper } from '../../mappers/userMappers';
import { IUserProfileRepository } from '../../../domain/interfaces/repositories/IUserProfileRepository';
export class UserGoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        private _googleAuthService: IGoogleAuthService,
        private _userRepository: IUserRepository,
        private _userProfileRepository: IUserProfileRepository
    ) {}

    async execute({ authorizationCode, role }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
        const { email, googleId, name } = await this._googleAuthService.authorize(authorizationCode);

        let user  = await this._userRepository.findByEmail(email);

        if (!user) {
            user = {
                email,
                name,
                role:UserRole.USER,
                isActive: UserStatus.ACTIVE,
                googleId,
           
            };
            const id = await this._userRepository.googleSignUp(user);
            user._id = id;
        }
         let userProfile: boolean = true;

        if(user.role === UserRole.USER) {
            const profile = await this._userProfileRepository.findByUserId(user._id!);
            if(!profile) {
                userProfile = false;
            }else if(profile.profileCompleted === true) {
                userProfile = true;
            }else {
                userProfile = false;
            }
        }


        return UserMapper.toLoginUserResponse(user,true,userProfile);
    }

}