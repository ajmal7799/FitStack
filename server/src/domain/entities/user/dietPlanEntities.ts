export interface IMealComponentEntity {
    time: string;
    items: string[];
    calories: string;
}

export interface IDietDayEntity {
    day: string;
    meals: {
        breakfast: IMealComponentEntity;
        midMorningSnack: IMealComponentEntity;
        lunch: IMealComponentEntity;
        eveningSnack: IMealComponentEntity;
        dinner: IMealComponentEntity;
    };
}

export interface DietPlan {
    id: string | null;
    userId: string;
    weeklyDietPlan: IDietDayEntity[];
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
}