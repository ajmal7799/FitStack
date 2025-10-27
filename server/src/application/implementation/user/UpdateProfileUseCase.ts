import { User } from "../../../domain/entities/user/userEntities";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { Errors, USER_ERRORS } from "../../../shared/constants/error";
import { UpdateProfileDTO } from "../../dto/user/updateProfileDTO";
import { IUpdateProfileUseCase } from "../../useCase/user/IUpdateProfileUseCase";


export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    private _userRepository : IUserRepository

    constructor (userRepository: IUserRepository) {
        this._userRepository = userRepository
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
        const existingUser = await this._userRepository.findById(userId)
        if(!existingUser) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND)
        }


        const updatedUser = await this._userRepository.updateProfile(userId,{
            ...data,
            profileCompleted:true
        })

        if(!updatedUser) {
            throw new Error(USER_ERRORS.UPDATE_FAILED)
        } 

        return updatedUser
    }
}