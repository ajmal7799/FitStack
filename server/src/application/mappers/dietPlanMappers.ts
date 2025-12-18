import { DietPlan } from "../../domain/entities/user/dietPlanEntities";
import { IDietPlanModel } from "../../infrastructure/database/models/dietPlanModel";
import { DietPlanResponseDto } from "../dto/user/dietPlanDTO";

export class DietPlanMapper {
    /**
     * Converts a Mongoose document to a clean Domain Entity
     */
    static fromMongooseDocument(doc: IDietPlanModel): DietPlan {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            weeklyDietPlan: doc.weeklyDietPlan.map(dayPlan => ({
                day: dayPlan.day,
                meals: {
                    breakfast: {
                        time: dayPlan.meals.breakfast.time,
                        items: dayPlan.meals.breakfast.items,
                        calories: dayPlan.meals.breakfast.calories
                    },
                    midMorningSnack: {
                        time: dayPlan.meals.midMorningSnack.time,
                        items: dayPlan.meals.midMorningSnack.items,
                        calories: dayPlan.meals.midMorningSnack.calories
                    },
                    lunch: {
                        time: dayPlan.meals.lunch.time,
                        items: dayPlan.meals.lunch.items,
                        calories: dayPlan.meals.lunch.calories
                    },
                    eveningSnack: {
                        time: dayPlan.meals.eveningSnack.time,
                        items: dayPlan.meals.eveningSnack.items,
                        calories: dayPlan.meals.eveningSnack.calories
                    },
                    dinner: {
                        time: dayPlan.meals.dinner.time,
                        items: dayPlan.meals.dinner.items,
                        calories: dayPlan.meals.dinner.calories
                    }
                }
            })),
            nutritionGuidelines: {
                dailyCalories: doc.nutritionGuidelines.dailyCalories,
                proteinIntake: doc.nutritionGuidelines.proteinIntake,
                hydration: doc.nutritionGuidelines.hydration,
                macroBalance: doc.nutritionGuidelines.macroBalance,
                mealTiming: doc.nutritionGuidelines.mealTiming
            },
            importantNotes: {
                hydrationTips: doc.importantNotes.hydrationTips,
                foodsToAvoid: doc.importantNotes.foodsToAvoid
            },
            weeklyGuidance: {
                adherence: doc.weeklyGuidance.adherence,
                adjustments: doc.weeklyGuidance.adjustments,
                duration: doc.weeklyGuidance.duration,
                progressTracking: doc.weeklyGuidance.progressTracking
            },
            isActive: doc.isActive,
            
        };
    }

    static toResponseDTO(entity: DietPlan): DietPlanResponseDto {
        return {
            id: entity.id || "",
            userId: entity.userId,
            weeklyDietPlan: entity.weeklyDietPlan.map(day => ({
                day: day.day,
                meals: {
                    breakfast: {
                        time: day.meals.breakfast.time,
                        items: day.meals.breakfast.items,
                        calories: day.meals.breakfast.calories
                    },
                    midMorningSnack: {
                        time: day.meals.midMorningSnack.time,
                        items: day.meals.midMorningSnack.items,
                        calories: day.meals.midMorningSnack.calories
                    },
                    lunch: {
                        time: day.meals.lunch.time,
                        items: day.meals.lunch.items,
                        calories: day.meals.lunch.calories
                    },
                    eveningSnack: {
                        time: day.meals.eveningSnack.time,
                        items: day.meals.eveningSnack.items,
                        calories: day.meals.eveningSnack.calories
                    },
                    dinner: {
                        time: day.meals.dinner.time,
                        items: day.meals.dinner.items,
                        calories: day.meals.dinner.calories
                    }
                }
            })),
            nutritionGuidelines: {
                dailyCalories: entity.nutritionGuidelines.dailyCalories,
                proteinIntake: entity.nutritionGuidelines.proteinIntake,
                hydration: entity.nutritionGuidelines.hydration,
                macroBalance: entity.nutritionGuidelines.macroBalance,
                mealTiming: entity.nutritionGuidelines.mealTiming
            },
            importantNotes: {
                hydrationTips: entity.importantNotes.hydrationTips,
                foodsToAvoid: entity.importantNotes.foodsToAvoid
            },
            weeklyGuidance: {
                adherence: entity.weeklyGuidance.adherence,
                adjustments: entity.weeklyGuidance.adjustments,
                duration: entity.weeklyGuidance.duration,
                progressTracking: entity.weeklyGuidance.progressTracking
            },
            isActive: entity.isActive,
            // Convert Date to ISO string for the frontend
            // createdAt: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString()
        };
    }
}