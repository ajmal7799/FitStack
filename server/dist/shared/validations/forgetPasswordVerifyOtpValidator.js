"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordVerifyOtpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const emailValidator_1 = require("./emailValidator");
const otpValidator_1 = require("./otpValidator");
exports.forgetPasswordVerifyOtpSchema = zod_1.default.object({
    email: emailValidator_1.emailSchema,
    otp: otpValidator_1.otpSchema,
});
