"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema_1 = __importDefault(require("../schema/messageSchema"));
exports.messageModel = (0, mongoose_1.model)("Message", messageSchema_1.default);
