"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLoginSchema = void 0;
const userEnums_1 = require("../../domain/enum/userEnums");
const error_1 = require("../constants/error");
const zod_1 = __importDefault(require("zod"));
exports.googleLoginSchema = zod_1.default.object({
    authorizationCode: zod_1.default.string({ error: error_1.Errors.AUTHENTICATION_CODE_MISSING }),
    role: zod_1.default
        .enum(userEnums_1.UserRole, {
        error: error_1.Errors.INVALID_ROLE,
    })
        .refine((role) => role !== userEnums_1.UserRole.ADMIN, {
        error: 'admin signup error',
    }),
});
