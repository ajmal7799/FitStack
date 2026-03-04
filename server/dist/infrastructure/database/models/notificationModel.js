"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema_1 = __importDefault(require("../schema/NotificationSchema"));
exports.notificationModel = (0, mongoose_1.model)('Notification', NotificationSchema_1.default);
