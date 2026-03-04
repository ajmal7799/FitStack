"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackModel = void 0;
const feedbackSchema_1 = __importDefault(require("../schema/feedbackSchema"));
const mongoose_1 = require("mongoose");
exports.feedbackModel = (0, mongoose_1.model)('Feedback', feedbackSchema_1.default);
