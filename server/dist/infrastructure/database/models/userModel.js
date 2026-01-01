"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema_1 = __importDefault(require("../schema/userSchema"));
exports.userModel = (0, mongoose_1.model)('User', userSchema_1.default);
// Basic Info
// profileImage?: string;
// dateOfBirth?: Date;
// gender?: UserGender;
// height?: number;
// weight?: number;
// targetWeight?: number;
// // Fitness Info
// fitnessGoal?: FitnessGoal;
// experienceLevel?: ExperienceLevel;
// preferredWorkoutType?: WorkoutType[];
// // Health & Diet
// medicalConditions?: string[];
// dietPreference?: DietPreference;
// // Goals & Tracking
// waterIntakeGoal?: number;
// // Tracking
// profileCompleted: boolean;
// // Timestamps (Document already provides these, but good to be explicit)
// createdAt: Date;
// updatedAt: Date;
