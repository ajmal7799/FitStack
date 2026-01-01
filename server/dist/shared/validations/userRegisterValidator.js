"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const emailValidator_1 = require("./emailValidator");
const userEnums_1 = require("../../domain/enum/userEnums");
exports.registerUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3, 'Name must be at least 3 characters'),
    email: emailValidator_1.emailSchema,
    password: zod_1.default.string().min(6, 'Password must be at least 6 characters').max(20, 'Password cannot exceed 20 characters'),
    phone: zod_1.default.string()
        .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    otp: zod_1.default.string().min(6),
    role: zod_1.default.enum(userEnums_1.UserRole),
});
