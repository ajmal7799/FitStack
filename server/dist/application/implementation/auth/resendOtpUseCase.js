"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
class ResendOtpUseCase {
    constructor(otpService, otpTemplateGenerator, emailService, userRepository, cacheStorage) {
        this._otpService = otpService;
        this._otpTemplateGenerator = otpTemplateGenerator;
        this._emailService = emailService;
        this._userRepository = userRepository;
        this._cacheStorage = cacheStorage;
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this._userRepository.findByEmail(email);
            if (existingUser) {
                throw new exceptions_1.AlreadyExisitingExecption(error_1.USER_ERRORS.USER_ALREADY_EXISTS);
            }
            const OTP = this._otpService.generateOtp();
            console.log(`RESENT-OTP : ${OTP} and email: ${email}`);
            const emailTemplate = {
                receiverEmail: email,
                subject: 'Your FitStack OTP',
                otp: OTP,
            };
            emailTemplate.content = this._otpTemplateGenerator.generateTemplate(OTP);
            this._emailService.sendEmail(emailTemplate);
            this._cacheStorage.setData(`otp/${email}`, 5 * 60, OTP);
        });
    }
}
exports.ResendOtpUseCase = ResendOtpUseCase;
