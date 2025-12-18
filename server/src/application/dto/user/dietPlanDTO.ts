import { DietPlan } from "../../../domain/entities/user/dietPlanEntities";

export interface MealDto {
  time: string;
  items: string[];
  calories: string;
}

export interface DayDietDto {
  day: string;
  meals: {
    breakfast: MealDto;
    midMorningSnack: MealDto;
    lunch: MealDto;
    eveningSnack: MealDto;
    dinner: MealDto;
  };
}

export interface DietPlanResponseDto {
  id: string;
  userId: string;
  weeklyDietPlan: DayDietDto[];
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
//   createdAt: string; // ISO string
}


export interface CreatedietPlanDTO {
    dietPlan: DietPlan
}