"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletModel = void 0;
// infrastructure/database/models/walletModel.ts
const mongoose_1 = require("mongoose");
const walletSchema_1 = __importDefault(require("../schema/walletSchema"));
exports.walletModel = (0, mongoose_1.model)('Wallet', walletSchema_1.default);
