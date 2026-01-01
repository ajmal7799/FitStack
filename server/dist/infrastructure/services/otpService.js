"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
class OtpService {
    generateOtp() {
        return Math.floor(Math.random() * 900000 + 100000).toString();
    }
}
exports.OtpService = OtpService;
