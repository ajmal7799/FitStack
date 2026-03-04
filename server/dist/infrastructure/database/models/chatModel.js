"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema_1 = __importDefault(require("../schema/chatSchema"));
exports.chatModel = (0, mongoose_1.model)('Chat', chatSchema_1.default);
