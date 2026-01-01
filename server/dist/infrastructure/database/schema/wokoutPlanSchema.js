"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ExerciseSchema = new mongoose_1.default.Schema({
    exerciseName: String,
    sets: Number,
    reps: String,
    rest: String,
    notes: String,
}, { _id: false });
const DayPlanSchema = new mongoose_1.default.Schema({
    day: String,
    focus: String,
    isRestDay: { type: Boolean, default: false },
    warmup: {
        duration: String,
        exercises: [String],
    },
    mainWorkout: [ExerciseSchema],
    cooldown: {
        duration: String,
        exercises: [String],
    },
}, { _id: false });
const WorkoutPlanSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    weeklyPlan: [DayPlanSchema],
    progressionGuidelines: mongoose_1.Schema.Types.Mixed,
    importantNotes: {
        safetyTips: [String],
        restAndRecovery: String,
        nutrition: String,
        hydration: String,
        whenToStopExercising: [String],
    },
    equipmentNeeded: [String],
    expectedResults: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});
WorkoutPlanSchema.index({ userId: 1, isActive: 1 });
exports.default = WorkoutPlanSchema;
