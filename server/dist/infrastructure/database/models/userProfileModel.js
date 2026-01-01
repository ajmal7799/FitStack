"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileModel = void 0;
const userProfileSchema_1 = __importDefault(require("../schema/userProfileSchema"));
const mongoose_1 = require("mongoose");
exports.userProfileModel = (0, mongoose_1.model)('UserProfile', userProfileSchema_1.default);
