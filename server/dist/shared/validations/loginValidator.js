"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const emailValidator_1 = require("./emailValidator");
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: emailValidator_1.emailSchema,
    password: zod_1.z.string().min(6).max(20),
});
