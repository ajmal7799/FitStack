"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordResetPasswordSchema = void 0;
const zod_1 = require("zod");
const emailValidator_1 = require("./emailValidator");
exports.forgetPasswordResetPasswordSchema = zod_1.z.object({
    email: emailValidator_1.emailSchema,
    password: zod_1.z.string().min(6).max(20),
    token: zod_1.z.string(),
});
