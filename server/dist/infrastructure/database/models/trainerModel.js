"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerModel = void 0;
const mongoose_1 = require("mongoose");
const trainerSchema_1 = __importDefault(require("../schema/trainerSchema"));
exports.trainerModel = (0, mongoose_1.model)('Trainer', trainerSchema_1.default);
