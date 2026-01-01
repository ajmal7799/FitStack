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
exports.ForgetPasswordSentOtp = void 0;
const error_1 = require("../../../shared/constants/error");
const messages_1 = require("../../../shared/constants/messages");
const exceptions_1 = require("../../constants/exceptions");
class ForgetPasswordSentOtp {
    constructor(_userRepository, _otpService, _OtpEmailContentGenerator, _emailService, cacheStorage) {
        this._userRepository = _userRepository;
        this._otpService = _otpService;
        this._OtpEmailContentGenerator = _OtpEmailContentGenerator;
        this._emailService = _emailService;
        this.cacheStorage = cacheStorage;
    }
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                throw new exceptions_1.NotFoundException(error_1.USER_ERRORS.USER_NOT_FOUND);
            }
            const otp = this._otpService.generateOtp();
            console.log(`OTP : ${otp} and email: ${email}`);
            const emailTemplate = {
                receiverEmail: email,
                subject: messages_1.MESSAGES.OTP.FORGET_PASSWORD_OTP,
                otp: otp,
            };
            emailTemplate.content = this._OtpEmailContentGenerator.generateTemplate(otp);
            this._emailService.sendEmail(emailTemplate);
            this.cacheStorage.setData(`FOR/${email}`, 5 * 60, otp);
        });
    }
}
exports.ForgetPasswordSentOtp = ForgetPasswordSentOtp;
