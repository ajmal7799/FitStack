"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userEnums_1 = require("../../../domain/enum/userEnums");
const userSchema = new mongoose_1.default.Schema({
    // Auth fields
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(userEnums_1.UserRole),
        default: userEnums_1.UserRole.USER,
    },
    isActive: {
        type: String,
        enum: Object.values(userEnums_1.UserStatus),
        default: userEnums_1.UserStatus.ACTIVE,
    },
    stripeCustomerId: {
        type: String,
        index: true,
        required: false,
    },
    activeMembershipId: {
        type: String,
        required: false,
    },
    profileImage: { type: String },
}, { timestamps: true });
exports.default = userSchema;
