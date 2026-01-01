"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerSelectModel = void 0;
const mongoose_1 = require("mongoose");
const trainerSelectSchema_1 = __importDefault(require("../schema/trainerSelectSchema"));
exports.trainerSelectModel = (0, mongoose_1.model)('TrainerSelect', trainerSelectSchema_1.default);
