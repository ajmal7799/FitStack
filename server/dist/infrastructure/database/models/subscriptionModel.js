"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionModel = void 0;
const subscriptionSchema_1 = __importDefault(require("../schema/subscriptionSchema"));
const mongoose_1 = require("mongoose");
exports.subscriptionModel = (0, mongoose_1.model)('Subscription', subscriptionSchema_1.default);
