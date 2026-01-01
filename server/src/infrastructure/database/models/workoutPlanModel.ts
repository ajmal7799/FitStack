import { Document, model, Types, Schema } from 'mongoose';
import WorkoutPlanSchema from '../schema/wokoutPlanSchema';

export interface IExercise {
    exerciseName: string;
    sets: number;
    reps: string;
    rest: string;
    notes: string;
}

export interface IDayPlan {
    day: string;
    focus: string;
    isRestDay: boolean;
    warmup?: {
        duration: string;
        exercises: string[];
    };
    mainWorkout: IExercise[];
    cooldown?: {
        duration: string;
        exercises: string[];
    };
}

export interface IWorkoutPlanModel extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    weeklyPlan: IDayPlan[];
    progressionaGuidelines: Record<string, string>;
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
    createdAt: Date;
}

export const workoutPlanModel = model<IWorkoutPlanModel>('WorkoutPlan', WorkoutPlanSchema);