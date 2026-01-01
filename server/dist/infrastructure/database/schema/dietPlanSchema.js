"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for individual meal components
const MealComponentSchema = new mongoose_1.default.Schema({
    time: String,
    items: [String],
    calories: String,
}, { _id: false });
// Schema for a single day containing all meals
const DayDietSchema = new mongoose_1.default.Schema({
    day: String,
    meals: {
        breakfast: MealComponentSchema,
        midMorningSnack: MealComponentSchema,
        lunch: MealComponentSchema,
        eveningSnack: MealComponentSchema,
        dinner: MealComponentSchema,
    },
}, { _id: false });
// Main Diet Plan Schema
const DietPlanSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    weeklyDietPlan: [DayDietSchema],
    nutritionGuidelines: {
        dailyCalories: String,
        proteinIntake: String,
        hydration: String,
        macroBalance: String,
        mealTiming: String,
    },
    importantNotes: {
        hydrationTips: String,
        foodsToAvoid: [String],
    },
    weeklyGuidance: {
        adherence: String,
        adjustments: String,
        duration: String,
        progressTracking: String,
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});
// Index for performance
DietPlanSchema.index({ userId: 1, isActive: 1 });
exports.default = DietPlanSchema;
