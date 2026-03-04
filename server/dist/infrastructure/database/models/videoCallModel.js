"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoCallModel = void 0;
const mongoose_1 = require("mongoose");
const videoCallSchema_1 = __importDefault(require("../schema/videoCallSchema"));
exports.videoCallModel = (0, mongoose_1.model)('VideoCall', videoCallSchema_1.default);
