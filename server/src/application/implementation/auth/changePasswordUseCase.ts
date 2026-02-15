import { IChangePasswordUseCase } from '../../useCase/auth/IChangePasswordUseCase';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IHashedPasswordServices } from '../../../domain/interfaces/services/IHashPasswordServices';
import { NotFoundException } from '../../constants/exceptions';
import { Errors, USER_ERRORS } from '../../../shared/constants/error';

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(private _userRepository: IUserRepository, private _hashedPasswordServices: IHashedPasswordServices) {}

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    const isOldPasswordValid = await this._hashedPasswordServices.comparePassword(oldPassword, user.password!);
    if (!isOldPasswordValid) {
      throw new NotFoundException(USER_ERRORS.OLD_PASSWORD_INCORRECT);
    }
    const hashedNewPassword = await this._hashedPasswordServices.hashPassword(newPassword);
    user.password = hashedNewPassword;
    await this._userRepository.updateUser(user);
  }
}
