"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipModel = void 0;
const mongoose_1 = require("mongoose");
const membershipSchema_1 = __importDefault(require("../schema/membershipSchema"));
exports.membershipModel = (0, mongoose_1.model)('Membership', membershipSchema_1.default);
