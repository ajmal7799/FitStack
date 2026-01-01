import { updateUserBodyMetricsRequestDTO, updateUserBodyMetricsResponseDTO } from "../../../dto/user/profile/updateUserBodyMetricsDTO";
import { IUpdateBodyMetricsUseCase } from "../../../useCase/user/profile/IUpdateBodyMetrics";
import { IUserProfileRepository } from "../../../../domain/interfaces/repositories/IUserProfileRepository";
import { NotFoundException } from "../../../constants/exceptions";
import { USER_ERRORS } from "../../../../shared/constants/error";
import { UserProfile } from "../../../../domain/entities/user/userProfile";

export class UpdateUserBodyMetricsUseCase implements IUpdateBodyMetricsUseCase{
    constructor(
        private _userProfileRepository: IUserProfileRepository
    ){}

    async execute(userId: string, data: updateUserBodyMetricsRequestDTO): Promise<UserProfile | null> {

        const user = await this._userProfileRepository.findByUserId(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_PROFILE_NOT_FOUND);
        }

        return  await this._userProfileRepository.updateUserProfile(userId, data);
    }
}