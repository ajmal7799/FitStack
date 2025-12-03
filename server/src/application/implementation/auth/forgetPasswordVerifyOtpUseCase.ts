import { IKeyValueTTLCaching } from '../../../domain/interfaces/services/ICache/IKeyValueTTLCaching';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { IForgetPasswordVerifyOtp } from '../../useCase/auth/IForgetPasswordVerifyOtp';
import { ForgetPasswordVerifyOtpRequestDTO } from '../../dto/auth/forgetPasswordDTO';
import { Errors } from '../../../shared/constants/error';
import { OTPExpiredException } from '../../constants/exceptions';

export class ForgetPasswordVerifyOtpUseCase implements IForgetPasswordVerifyOtp {
    constructor(
        private cacheStorage: IKeyValueTTLCaching,
        private tokenService: ITokenService,
    ) { }

    async verifyOtp(dto: ForgetPasswordVerifyOtpRequestDTO): Promise<string> {
        const cachedOtp = await this.cacheStorage.getData(`FOR/${dto.email}`);
        console.log('cachedOtp:', cachedOtp);
        if (!cachedOtp) {
            throw new OTPExpiredException(Errors.OTP_MISSING);
        }
        const otpVerified = dto.otp === cachedOtp;
        if (otpVerified) {
            await this.cacheStorage.deleteData(`FOR/${dto.email}`);
            const resetToken = this.tokenService.createToken();
            this.cacheStorage.setData(`RTP/${dto.email}`, 10 * 60, resetToken);
            return resetToken;
        } else {
            throw new OTPExpiredException(Errors.OTP_MISMATCH);
        }
    }


}