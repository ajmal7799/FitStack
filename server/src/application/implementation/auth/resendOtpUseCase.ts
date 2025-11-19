import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "../../../domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IEmailContentGenerator } from "../../../domain/interfaces/services/Email/IEmailContentGenerator";
import { IEmailService } from "../../../domain/interfaces/services/Email/IEmailService";
import { IOtpEmailTemplate } from "../../../domain/interfaces/services/Email/IOtpEmailTemplate";
import { IOtpService } from "../../../domain/interfaces/services/IOtp/IOtp";
import { IResendOtpUseCase } from "../../useCase/auth/IResendOtp";
import { USER_ERRORS } from "../../../shared/constants/error";
import { AlreadyExisitingExecption } from "../../constants/exceptions";

export class ResendOtpUseCase implements IResendOtpUseCase {
    private _otpService: IOtpService;
    private _otpTemplateGenerator: IEmailContentGenerator;
    private _emailService: IEmailService;
    private _userRepository: IUserRepository;
    private _cacheStorage: IKeyValueTTLCaching;

    constructor(
        otpService: IOtpService,
        otpTemplateGenerator: IEmailContentGenerator,
        emailService: IEmailService,
        userRepository: IUserRepository,
        cacheStorage: IKeyValueTTLCaching
    ) {
        this._otpService = otpService;
        this._otpTemplateGenerator = otpTemplateGenerator;
        this._emailService = emailService;
        this._userRepository = userRepository;
        this._cacheStorage = cacheStorage;
    }

    async resendOtp(email: string): Promise<void> {
        const existingUser = await this._userRepository.findByEmail(email)

        if (existingUser) {
            throw new AlreadyExisitingExecption(USER_ERRORS.USER_ALREADY_EXISTS)
        }

        const OTP = this._otpService.generateOtp();
        console.log(`RESENT-OTP : ${OTP} and email: ${email}`);
        const emailTemplate: IOtpEmailTemplate = {
            receiverEmail: email,
            subject: "Your FitStack OTP",
            otp: OTP,
        };

        emailTemplate.content = this._otpTemplateGenerator.generateTemplate(OTP);
        this._emailService.sendEmail(emailTemplate as Required<IOtpEmailTemplate>);
        this._cacheStorage.setData(`otp/${email}`, 5 * 60, OTP);
    }

}