import { UserStatus } from "../../../../domain/enum/userEnums";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IUpdateTrainerStatusUseCase } from "../../../useCase/admin/trainer/IUpdateTrainerUseCase";
import { USER_ERRORS } from "../../../../shared/constants/error";
import { NotFoundException } from "../../../constants/exceptions";
import { UserDTO } from "../../../dto/user/userDTO";


export class UpdateTrainerStatusUseCase implements IUpdateTrainerStatusUseCase {
    constructor(private _userRepository: IUserRepository) { }

    async updateTrainerStatus(userId: string, currentStatus: UserStatus): Promise<{ user: UserDTO; }> {
        const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

        const updatedUser = await this._userRepository.updateStatus(userId, newStatus)

        if (!updatedUser) throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND)

        return { user: updatedUser as UserDTO }
    }
}
