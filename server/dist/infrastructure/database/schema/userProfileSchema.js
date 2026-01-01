"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userProfileEnums_1 = require("../../../domain/enum/userProfileEnums");
const mongoose_1 = __importDefault(require("mongoose"));
const userProfileSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: Object.values(userProfileEnums_1.UserGender), required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitnessGoal: { type: String, enum: Object.values(userProfileEnums_1.FitnessGoal), required: true },
    targetWeight: { type: Number, required: true },
    dietPreference: { type: String, enum: Object.values(userProfileEnums_1.DietPreference), default: null },
    experienceLevel: { type: String, enum: Object.values(userProfileEnums_1.ExperienceLevel), required: true },
    workoutLocation: { type: String, enum: Object.values(userProfileEnums_1.PreferredWorkoutType), required: true },
    preferredWorkoutTypes: { type: [String], required: true },
    medicalConditions: { type: [String], default: [] },
    profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = userProfileSchema;
