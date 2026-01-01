import mongoose, { Schema, Document } from 'mongoose';

// Schema for individual meal components
const MealComponentSchema = new mongoose.Schema({
    time: String,
    items: [String],
    calories: String,
}, { _id: false });

// Schema for a single day containing all meals
const DayDietSchema = new mongoose.Schema({
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
const DietPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

export default DietPlanSchema;