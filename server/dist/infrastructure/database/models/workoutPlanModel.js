"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutPlanModel = void 0;
const mongoose_1 = require("mongoose");
const wokoutPlanSchema_1 = __importDefault(require("../schema/wokoutPlanSchema"));
exports.workoutPlanModel = (0, mongoose_1.model)('WorkoutPlan', wokoutPlanSchema_1.default);
