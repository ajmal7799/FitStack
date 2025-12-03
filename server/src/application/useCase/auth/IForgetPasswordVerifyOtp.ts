import { ForgetPasswordVerifyOtpRequestDTO } from '../../dto/auth/forgetPasswordDTO';

export interface IForgetPasswordVerifyOtp {
    verifyOtp(dto: ForgetPasswordVerifyOtpRequestDTO): Promise<string>;
}