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
exports.VerifyOtpUseCase = void 0;
const error_1 = require("../../../shared/constants/error");
const exceptions_1 = require("../../constants/exceptions");
class VerifyOtpUseCase {
    constructor(cacheStorage) {
        this._cacheStorage = cacheStorage;
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedOtp = yield this._cacheStorage.getData(`otp/${email}`);
            console.log('cachedOtp:', cachedOtp);
            if (!cachedOtp) {
                throw new exceptions_1.OTPExpiredException(error_1.Errors.OTP_MISSING);
            }
            const otpVerified = otp === cachedOtp;
            if (otpVerified) {
                yield this._cacheStorage.deleteData(`otp/${email}`);
            }
            return otpVerified;
        });
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
