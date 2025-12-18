import { Document, model, Types } from 'mongoose';
import DietPlanSchema from '../schema/dietPlanSchema';

export interface IMeal {
  time: string;
  items: string[];
  calories: string;
}

export interface IDietDay {
  day: string;
  meals: {
    breakfast: IMeal;
    midMorningSnack: IMeal;
    lunch: IMeal;
    eveningSnack: IMeal;
    dinner: IMeal;
  };
}

export interface IDietPlanModel extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  weeklyDietPlan: IDietDay[];
  nutritionGuidelines: {
    dailyCalories: string;
    proteinIntake: string;
    hydration: string;
    macroBalance: string;
    mealTiming: string;
  };
  importantNotes: {
    hydrationTips: string;
    foodsToAvoid: string[];
  };
  weeklyGuidance: {
    adherence: string;
    adjustments: string;
    duration: string;
    progressTracking: string;
  };
  isActive: boolean;
  createdAt: Date;
}

export const DietPlanModel = model<IDietPlanModel>('DietPlan', DietPlanSchema);
