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
exports.ForgetPasswordVerifyOtpUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
class ForgetPasswordVerifyOtpUseCase {
    constructor(cacheStorage, tokenService) {
        this.cacheStorage = cacheStorage;
        this.tokenService = tokenService;
    }
    verifyOtp(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedOtp = yield this.cacheStorage.getData(`FOR/${dto.email}`);
            console.log('cachedOtp:', cachedOtp);
            if (!cachedOtp) {
                throw new exceptions_1.OTPExpiredException(error_1.Errors.OTP_MISSING);
            }
            const otpVerified = dto.otp === cachedOtp;
            if (otpVerified) {
                yield this.cacheStorage.deleteData(`FOR/${dto.email}`);
                const resetToken = this.tokenService.createToken();
                this.cacheStorage.setData(`RTP/${dto.email}`, 10 * 60, resetToken);
                return resetToken;
            }
            else {
                throw new exceptions_1.OTPExpiredException(error_1.Errors.OTP_MISMATCH);
            }
        });
    }
}
exports.ForgetPasswordVerifyOtpUseCase = ForgetPasswordVerifyOtpUseCase;
