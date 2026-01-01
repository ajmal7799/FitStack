"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationModel = void 0;
const mongoose_1 = require("mongoose");
const verificationSchema_1 = __importDefault(require("../schema/verificationSchema"));
exports.verificationModel = (0, mongoose_1.model)('Verification', verificationSchema_1.default);
