import { WorkoutPlan } from "../../../domain/entities/user/workoutPlanEntities";

export interface ExerciseDto {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface DayPlanDto {
  day: string;
  focus: string;
  isRestDay: boolean;
  warmup?: {
    duration: string;
    exercises: string[];
  };
  mainWorkout: ExerciseDto[];
  cooldown?: {
    duration: string;
    exercises: string[];
  };
}

export interface WorkoutPlanResponseDto {
  id: string;
  userId: string;
  weeklyPlan: DayPlanDto[];
  progressionGuidelines: Record<string, string>;
  importantNotes: {
    safetyTips: string[];
    restAndRecovery: string;
    nutrition: string;
    hydration: string;
    whenToStopExercising: string[];
  };
  equipmentNeeded: string[];
  expectedResults: string;
  isActive: boolean;
//   createdAt: string; // ISO string format for the frontend
}

export interface CreateWorkoutPlanResponseDTO {
    workoutPlan: WorkoutPlan
}