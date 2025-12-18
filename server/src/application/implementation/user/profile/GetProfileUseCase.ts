import { IGetProfileUseCase } from "../../../useCase/user/profile/IGetProfileUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { UserMapper } from "../../../mappers/userMappers";
import { NotFoundException } from "../../../constants/exceptions";
import { USER_ERRORS } from "../../../../shared/constants/error";
export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(
        private  _userRepository: IUserRepository
    ) { }
    async execute(userId: string): Promise<any> {
       const user = await this._userRepository.findById(userId);
       
       if(!user) {
           throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
       }

       return UserMapper.toLoginUserResponse(user);
    }
}