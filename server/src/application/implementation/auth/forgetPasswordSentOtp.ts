import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IEmailContentGenerator } from '../../../domain/interfaces/services/Email/IEmailContentGenerator';
import { IEmailService } from '../../../domain/interfaces/services/Email/IEmailService';
import { IOtpEmailTemplate } from '../../../domain/interfaces/services/Email/IOtpEmailTemplate';
import { IOtpService } from '../../../domain/interfaces/services/IOtp/IOtp';
import { Errors, USER_ERRORS } from '../../../shared/constants/error';
import { MESSAGES } from '../../../shared/constants/messages';
import { NotFoundException } from '../../constants/exceptions';
import { IForgetPasswordSentOtpUseCase } from '../../useCase/auth/IForgetPasswordSentOtp';
import { IKeyValueTTLCaching } from '../../../domain/interfaces/services/ICache/IKeyValueTTLCaching';


export class ForgetPasswordSentOtp implements IForgetPasswordSentOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpService: IOtpService,
        private _OtpEmailContentGenerator: IEmailContentGenerator,
        private _emailService: IEmailService,
        private cacheStorage: IKeyValueTTLCaching,
    ) { }

    async sendOtp(email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        const otp = this._otpService.generateOtp();
        console.log(`OTP : ${otp} and email: ${email}`);
        const emailTemplate: IOtpEmailTemplate = {
            receiverEmail: email,
            subject: MESSAGES.OTP.FORGET_PASSWORD_OTP,
            otp: otp,
        };

        emailTemplate.content = this._OtpEmailContentGenerator.generateTemplate(otp);
        this._emailService.sendEmail(emailTemplate as Required<IOtpEmailTemplate>);
        this.cacheStorage.setData(`FOR/${email}`,5*60, otp);
    }
}