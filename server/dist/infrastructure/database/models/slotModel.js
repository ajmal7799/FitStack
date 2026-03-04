"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotModel = void 0;
const mongoose_1 = require("mongoose");
const slotSchema_1 = __importDefault(require("../schema/slotSchema"));
exports.slotModel = (0, mongoose_1.model)('Slot', slotSchema_1.default);
