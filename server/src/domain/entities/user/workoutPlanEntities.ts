// src/domain/entities/workout/IDayPlanEntity.ts

export interface IExerciseEntity {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface IDayPlanEntity {
  day: string; 
  focus: string; 
  isRestDay: boolean;
  warmup?: {
    duration: string;
    exercises: string[];
  };
  mainWorkout: IExerciseEntity[];
  cooldown?: {
    duration: string;
    exercises: string[];
  };
}

export interface WorkoutPlan {
    id: string,
    userId: string,
    weeklyPlan: IDayPlanEntity[],
    progressionaGuidelines: Record<string, string>,
    importantNotes: {
        safetyTips: string[];
        restAndRecovery: string;
        nutrition: string;
        hydration: string;
        whenToStopExercising: string[];
    },
    equipmentNeeded: string[],
    expectedResults: string,
    isActive: boolean
}