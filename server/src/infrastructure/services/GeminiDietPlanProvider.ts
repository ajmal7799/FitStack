import { UserProfile } from '../../domain/entities/user/userProfile';
import { IDietPlanProvider } from '../../domain/interfaces/services/IDietPlanAiProvider';
import { CONFIG } from '../config/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DietPlan } from '../../domain/entities/user/dietPlanEntities';

export class GeminiDietProvider implements IDietPlanProvider {
    private _genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = CONFIG.GEMINI_API_KEY!;
        this._genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateDietPlan(profile: UserProfile): Promise<DietPlan|null> {
        const model = this._genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        });

        try {
            const prompt = this.buildDietPrompt(profile);
            const result = await model.generateContent(prompt);
      
            const response = result.response;
            const text = response.text();
            console.log('text', text);
            // Clean and parse JSON
            let cleanText = text.trim();
      
            if (cleanText.includes('```')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }
      
            const jsonStart = cleanText.indexOf('{');
            const jsonEnd = cleanText.lastIndexOf('}') + 1;
       
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
                cleanText = cleanText.substring(jsonStart, jsonEnd);
            }
      
            return JSON.parse(cleanText);
      
        } catch (error) {
            console.error('Error generating diet plan:', error);
            return null;
        }
    }

    private buildDietPrompt(profile: UserProfile): string {
        const medicalConditions = profile.medicalConditions && profile.medicalConditions.length > 0
            ? profile.medicalConditions.join(', ')
            : 'none';

        const weightChange = profile.targetWeight - profile.weight;
        const weightChangeAmount = Math.abs(weightChange).toFixed(1);
        const weightChangeDirection = weightChange > 0 ? 'gain' : weightChange < 0 ? 'lose' : 'maintain';

        const dietType = profile.dietPreference || 'omnivore';

        return `You are a certified fitness nutrition planner.

Generate a SAFE, PRACTICAL, and GOAL-ORIENTED WEEKLY DIET PLAN based strictly on the user profile below.

DO NOT give medical advice.
DO NOT include supplements, pills, or extreme diets.
DO NOT exceed realistic calorie control.
DO NOT ask follow-up questions.

USER PROFILE
----------------------------
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Target Weight: ${profile.targetWeight} kg
Weight Change Goal: ${weightChangeDirection} ${weightChangeAmount} kg
Fitness Goal: ${profile.fitnessGoal}
Diet Preference: ${dietType}
Medical Conditions: ${medicalConditions}

DIET PLANNING RULES
----------------------------
- Generate a 7-day weekly diet plan
- Include 5 meals per day:
  - Breakfast
  - Mid-morning snack
  - Lunch
  - Evening snack
  - Dinner

- Meals must be simple and realistic
- Use commonly available foods
- Avoid extreme calorie restriction
- Balance protein, carbs, and healthy fats
- Provide specific portions (e.g., "1 cup rice", "2 eggs", "100g chicken")

DIET TYPE: ${dietType.toUpperCase()}
----------------------------
${this.getDietTypeGuidelines(dietType)}

GOAL ADJUSTMENTS
----------------------------
${this.getGoalGuidance(profile.fitnessGoal, weightChange)}

MEDICAL CONSIDERATIONS
----------------------------
${medicalConditions !== 'none' 
        ? `User has: ${medicalConditions}. Avoid trigger foods and prefer balanced, easily digestible meals.`
        : 'No medical conditions. Standard healthy eating applies.'}

REQUIRED JSON OUTPUT FORMAT
----------------------------
{
  "weeklyDietPlan": [
    {
      "day": "Day 1",
      "meals": {
        "breakfast": {
          "time": "7:00 AM - 8:00 AM",
          "items": ["food item with portion", "food item with portion"],
          "calories": "400-450 calories"
        },
        "midMorningSnack": {
          "time": "10:00 AM - 10:30 AM",
          "items": ["snack item", "snack item"],
          "calories": "150-200 calories"
        },
        "lunch": {
          "time": "12:30 PM - 1:30 PM",
          "items": ["food item with portion", "food item with portion"],
          "calories": "500-550 calories"
        },
        "eveningSnack": {
          "time": "4:00 PM - 5:00 PM",
          "items": ["snack item", "snack item"],
          "calories": "150-200 calories"
        },
        "dinner": {
          "time": "7:00 PM - 8:00 PM",
          "items": ["food item with portion", "food item with portion"],
          "calories": "400-450 calories"
        }
      }
    }
  ],
  "nutritionGuidelines": {
    "dailyCalories": "string - target daily calorie range",
    "proteinIntake": "string - daily protein target in grams",
    "hydration": "string - daily water intake (e.g., 3-4 liters)",
    "macroBalance": "string - recommended macro split",
    "mealTiming": "string - tips on meal spacing and consistency"
  },
  "importantNotes": {
    "hydrationTips": "string - importance of drinking water",
    "foodsToAvoid": ["food/habit to avoid", "food/habit to avoid"],
  },
  "weeklyGuidance": {
    "adherence": "string - importance of consistency",
    "adjustments": "string - when and how to adjust portions",
    "duration": "string - how long to follow this plan",
    "progressTracking": "string - what to monitor weekly"
  }
}

CRITICAL REQUIREMENTS
----------------------------
1. Meals must match ${dietType} preference
2. Include specific portions for all food items
3. Keep meals simple and achievable
4. Vary meals throughout the week
5. Include adequate protein in every meal
6. Balance all macronutrients
7. Calorie ranges should be realistic
8. If medical conditions exist, avoid risky foods

IMPORTANT
----------------------------
- No emojis
- No motivational speeches
- No disclaimers
- Keep language simple and practical
- Focus on commonly available foods

Generate the complete diet plan now in the exact JSON format specified above.`;
    }

    private getDietTypeGuidelines(dietType: string): string {
        const guidelines: Record<string, string> = {
            vegan: `- NO animal products (meat, dairy, eggs, honey)
- Protein: tofu, tempeh, lentils, chickpeas, beans, quinoa
- Include B12 sources (nutritional yeast, fortified foods)
- Calcium: fortified plant milk, leafy greens`,

            vegetarian: `- NO meat, poultry, or fish
- Allowed: dairy, eggs, plant foods
- Protein: eggs, Greek yogurt, paneer, legumes, tofu
- Include variety of dairy for calcium and B12`,

            omnivore: `- All food groups allowed
- Protein: chicken, fish, eggs, lean meat, legumes
- Focus on lean proteins and limit processed meats
- Balance animal and plant-based meals`,

            other: `- Flexible approach based on preferences
- Focus on whole, minimally processed foods
- Include diverse protein sources
- Balance all macronutrients`,
        };

        return guidelines[dietType] || guidelines.other;
    }

    private getGoalGuidance(goal: string, weightChange: number): string {
        if (goal === 'lose weight' || weightChange < 0) {
            return `- Fat loss: moderate calorie deficit
- High protein for satiety and muscle preservation
- Moderate carbs, prefer complex carbs
- Include fiber-rich foods
- Expected rate: 0.5-1kg loss per week`;
        }

        if (goal === 'gain muscle' || weightChange > 0) {
            return `- Muscle gain: calorie surplus
- High protein intake (2g per kg bodyweight)
- Higher carbs for energy and recovery
- Include calorie-dense foods
- Expected rate: 0.25-0.5kg gain per week`;
        }

        return `- Maintenance: balanced calorie intake
- Adequate protein for muscle maintenance
- Balanced macronutrients
- Focus on whole foods and consistency`;
    }
}