"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanModel = void 0;
const mongoose_1 = require("mongoose");
const dietPlanSchema_1 = __importDefault(require("../schema/dietPlanSchema"));
exports.DietPlanModel = (0, mongoose_1.model)('DietPlan', dietPlanSchema_1.default);
