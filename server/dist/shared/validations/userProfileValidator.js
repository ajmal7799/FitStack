"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPersonalInfoSchema = exports.userProfile = void 0;
const zod_1 = __importDefault(require("zod"));
const emailValidator_1 = require("./emailValidator");
exports.userProfile = zod_1.default.object({
    name: zod_1.default.string().min(3, 'Name must be at least 3 characters'),
    email: emailValidator_1.emailSchema,
    phone: zod_1.default.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    profileImage: zod_1.default.any().optional(),
});
exports.userPersonalInfoSchema = exports.userProfile.partial();
