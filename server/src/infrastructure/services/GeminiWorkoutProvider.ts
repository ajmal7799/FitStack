import { UserProfile } from '../../domain/entities/user/userProfile';
import { IWorkoutAIProvider } from '../../domain/interfaces/services/IWorkoutAIProvider';
import { CONFIG } from '../config/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WorkoutPlan } from '../../domain/entities/user/workoutPlanEntities';

export class GeminiWorkoutProvider implements IWorkoutAIProvider {
    private _genAI: GoogleGenerativeAI;
    constructor() {
        const apiKey = CONFIG.GEMINI_API_KEY!;
        this._genAI = new GoogleGenerativeAI(apiKey);
    }

    async generatePlan(profile: UserProfile): Promise<WorkoutPlan|null> {

        const model = this._genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        });

        try {
            const prompt = this.buildWorkoutPrompt(profile);
            const result = await model.generateContent(prompt);

      
            const response = await result.response;
            const text = response.text();
            return JSON.parse(text);
        } catch (error) {
            console.log('error', error);
            return null;
        }
    }

    private buildWorkoutPrompt(profile: UserProfile): string {
    // Format medical conditions
        const medicalConditions =
      profile.medicalConditions && profile.medicalConditions.length > 0 ? profile.medicalConditions.join(', ') : 'none';

        // Format preferred workout types
        const preferredWorkoutTypes =
      profile.preferredWorkoutTypes && profile.preferredWorkoutTypes.length > 0
          ? profile.preferredWorkoutTypes.map(type => `- ${type}`).join('\n')
          : '- mixed';

        // Calculate weight change
        const weightChange = profile.targetWeight - profile.weight;
        const weightChangeAmount = Math.abs(weightChange).toFixed(1);
        const weightChangeDirection = weightChange > 0 ? 'gain' : weightChange < 0 ? 'lose' : 'maintain';

        return `Generate a SAFE, REALISTIC, and STRUCTURED WEEKLY WORKOUT PLAN based strictly on the user profile below.

DO NOT give medical advice.
DO NOT include dangerous or extreme exercises.
DO NOT exceed the user's experience level.
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
Experience Level: ${profile.experienceLevel}
Workout Location: ${profile.workoutLocation}
Preferred Workout Types:
${preferredWorkoutTypes}
Medical Conditions:
${medicalConditions}
${medicalConditions !== 'none' ? '(Consider modifications for these conditions)' : ''}

WORKOUT STRUCTURE RULES
----------------------------
- Generate a 7-day weekly plan
- 5-6 workout days + 1-2 rest days (adjust based on experience level)
- Rest days must be clearly labeled
- Adjust intensity based on experience level:
  - Beginner → 3-4 workout days, low impact, longer rest periods (90-120 seconds), simple movements, 5-6 exercises per session
  - Intermediate → 4-5 workout days, moderate volume, 60-90 seconds rest, compound and isolation movements, 6-7 exercises
  - Advanced → 5-6 workout days, higher volume, 45-60 seconds rest, advanced techniques allowed, 6-7 exercises

- If workout location is HOME:
  - Use bodyweight exercises primarily
  - May include: dumbbells, resistance bands, yoga mat
  - Do NOT include: barbells, machines, benches (unless explicitly mentioned)
  - Focus on: push-ups, squats, lunges, planks, burpees, mountain climbers, etc.
  
- If workout location is GYM:
  - May include: barbells, dumbbells, machines, cables, benches
  - Can use: squat rack, leg press, chest press machine, lat pulldown, etc.

- If medical conditions exist:
  - Avoid high-impact movements for joint issues
  - Prefer controlled, safe alternatives
  - Include appropriate modifications

EACH WORKOUT DAY MUST INCLUDE
----------------------------
- Warm-up (5–10 minutes): Dynamic stretching, light cardio
- Main workout: Specific exercises with sets and reps
- Cool-down (5 minutes): Static stretching, breathing exercises

REQUIRED JSON OUTPUT FORMAT
----------------------------
{
  "weeklyPlan": [
    {
      "day": "Day 1",
      "focus": "string - e.g., 'Upper Body Strength' or 'Rest Day'",
      "isRestDay": boolean,
      "warmup": {
        "duration": "5-10 minutes",
        "exercises": ["exercise 1", "exercise 2", "exercise 3"]
      },
      "mainWorkout": [
        {
          "exerciseName": "string",
          "sets": number,
          "reps": "string - e.g., '8-12' or '30 seconds' or 'AMRAP'",
          "rest": "string - e.g., '60 seconds'",
          "notes": "string - form tips or modifications"
        }
      ],
      "cooldown": {
        "duration": "5 minutes",
        "exercises": ["stretch 1", "stretch 2", "stretch 3"]
      }
    }
  ],
  "progressionGuidelines": {
    "week1": "string - Focus and intensity for week 1",
    "week2": "string - How to progress in week 2",
    "week3": "string - How to progress in week 3",
    "week4": "string - Peak week or deload recommendations"
  },
  "importantNotes": {
    "safetyTips": ["tip 1", "tip 2", "tip 3"],
    "restAndRecovery": "string - Importance of rest days and sleep",
    "nutrition": "string - Brief guidance: calorie surplus/deficit, protein intake",
    "hydration": "string - Daily water intake recommendation",
    "whenToStopExercising": ["warning sign 1", "warning sign 2"]
  },
  "equipmentNeeded": ["equipment 1", "equipment 2"],
  "expectedResults": "string - Realistic expectations after 4 weeks of following this plan"
}

EXERCISE SELECTION GUIDELINES
----------------------------
Based on fitness goal "${profile.fitnessGoal}":

${this.getGoalSpecificGuidelines(profile.fitnessGoal)}

Based on preferred workout types (${profile.preferredWorkoutTypes?.join(', ') || 'mixed'}):
${this.getWorkoutTypeGuidelines(profile.preferredWorkoutTypes || ['mixed'])}

EXPERIENCE LEVEL ADJUSTMENTS
----------------------------
${this.getExperienceLevelDetails(profile.experienceLevel)}

CRITICAL SAFETY REQUIREMENTS
----------------------------
1. All exercises must be appropriate for ${profile.experienceLevel} level
2. If medical conditions exist (${medicalConditions}), provide modifications
3. Include proper form cues in the "notes" field
4. Progressive overload should be gradual and safe
5. Rest periods must be adequate for recovery
6. Warm-up and cool-down are MANDATORY for every workout day

MONTHLY PROGRESSION NOTE
----------------------------
This weekly plan should be followed for 4 weeks with gradual progression:
- Week 1: Focus on learning proper form and technique
- Week 2: Maintain form, slightly increase weight or reps
- Week 3: Continue progression, may add 1-2 reps or 2-5% weight
- Week 4: Deload week (reduce volume by 30-40%) or continue progression

Rest and recovery are essential for results. Adequate sleep (7-9 hours) and nutrition are crucial.

IMPORTANT REMINDERS
----------------------------
- Be concise and practical
- No emojis
- No motivational speeches  
- No medical disclaimers in the output
- Focus on clarity and actionable information
- Ensure all exercises are possible with available equipment at ${profile.workoutLocation}

Generate the complete workout plan now in the exact JSON format specified above.`;
    }

    private getGoalSpecificGuidelines(goal: string): string {
        const guidelines: Record<string, string> = {
            'lose weight': `- Prioritize compound movements that burn more calories
- Include cardio intervals or HIIT components
- Higher rep ranges (12-15+)
- Shorter rest periods (30-60 seconds)
- Circuit training can be effective
- Focus on full-body workouts or upper/lower splits`,

            'gain muscle': `- Focus on progressive overload with compound movements
- Primary lifts: squats, deadlifts, bench press, rows, overhead press
- Moderate to heavy weights with 6-12 rep range
- Adequate rest between sets (90-120 seconds)
- Use split routines: push/pull/legs or upper/lower
- Include isolation exercises for targeted muscle growth`,

            'maintain fitness': `- Balanced mix of strength and cardio
- Full-body workouts 3-4 times per week
- Varied rep ranges (6-15 reps)
- Maintain current intensity and volume
- Include flexibility work`,

            'improve endurance': `- High rep ranges (15-20+)
- Shorter rest periods (30-45 seconds)
- Circuit training and supersets
- Include cardio intervals between strength exercises
- Focus on muscular endurance and stamina`,

            flexibility: `- Dynamic stretching in warm-ups
- Static stretching in cool-downs (hold 30-60 seconds)
- Include yoga poses and mobility drills
- Full range of motion in all exercises
- Foam rolling and myofascial release`,

            'general health': `- Well-rounded approach with variety
- Mix of strength, cardio, and flexibility
- Functional movements that improve daily activities
- Moderate intensity, sustainable long-term
- Include balance and coordination exercises`,
        };

        return guidelines[goal] || guidelines['general health'];
    }

    private getWorkoutTypeGuidelines(types: string[]): string {
        const guidelines: Record<string, string> = {
            strength: 'Focus on compound lifts, progressive overload, heavier weights with lower reps (6-12)',
            cardio: 'Include running, cycling, HIIT, jump rope, or cardio machines. Aim for 20-30 minutes per session',
            flexibility: 'Incorporate yoga flows, dynamic stretches, static holds, and mobility drills',
            mixed: 'Combine strength training with cardio intervals and flexibility work for balanced fitness',
        };

        if (types.length === 1) {
            return guidelines[types[0]] || guidelines['mixed'];
        }

        return types.map(type => `- ${type}: ${guidelines[type] || 'Include varied exercises'}`).join('\n');
    }

    private getExperienceLevelDetails(level: string): string {
        const details: Record<string, string> = {
            beginner: `- Start with 3-4 workout days per week
- Focus on bodyweight and machine exercises first
- Learn proper form before adding weight
- Rest periods: 90-120 seconds
- Session duration: 30-45 minutes
- Limit to 8-10 exercises per session
- Avoid advanced techniques (drop sets, supersets)
- Progress slowly to prevent injury`,

            intermediate: `- 4-5 workout days per week
- Mix of free weights and machines
- Can handle moderate volume and intensity
- Rest periods: 60-90 seconds
- Session duration: 45-60 minutes
- 10-12 exercises per session
- Can incorporate supersets and compound sets
- Ready for split routines`,

            advanced: `- 5-6 workout days per week
- Heavy emphasis on free weights
- High volume and intensity training
- Rest periods: 45-60 seconds (adjust for heavy lifts)
- Session duration: 60-90 minutes
- 12-15 exercises per session
- Can use advanced techniques: drop sets, rest-pause, tempo training
- May benefit from periodization and deload weeks`,
        };

        return details[level] || details['beginner'];
    }
}
