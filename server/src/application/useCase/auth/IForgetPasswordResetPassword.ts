import { ForgetPasswordResetPasswordRequestDTO } from '../../dto/auth/forgetPasswordDTO';

export interface IForgetPasswordResetPassword {
    resetPassword(dto: ForgetPasswordResetPasswordRequestDTO): Promise<void>;
}