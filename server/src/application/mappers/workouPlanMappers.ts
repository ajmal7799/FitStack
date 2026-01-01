import { IWorkoutPlanModel } from '../../infrastructure/database/models/workoutPlanModel';
import { WorkoutPlan } from '../../domain/entities/user/workoutPlanEntities';
import { WorkoutPlanResponseDto } from '../dto/user/workoutPlanDTO';

export class WorkoutPlanMapper {
    static fromMongooseDocument(doc: IWorkoutPlanModel): WorkoutPlan {
        return {
            id: doc._id.toString(), 
            userId: doc.userId.toString(),
            weeklyPlan: doc.weeklyPlan.map(day => ({
                day: day.day,
                focus: day.focus,
                isRestDay: day.isRestDay,
                warmup: day.warmup ? {
                    duration: day.warmup.duration,
                    exercises: day.warmup.exercises,
                } : undefined,
                mainWorkout: day.mainWorkout.map(ex => ({
                    exerciseName: ex.exerciseName,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: ex.rest,
                    notes: ex.notes,
                })),
                cooldown: day.cooldown ? {
                    duration: day.cooldown.duration,
                    exercises: day.cooldown.exercises,
                } : undefined,
            })),
            progressionaGuidelines: doc.progressionaGuidelines,
            importantNotes: {
                safetyTips: doc.importantNotes.safetyTips,
                restAndRecovery: doc.importantNotes.restAndRecovery,
                nutrition: doc.importantNotes.nutrition,
                hydration: doc.importantNotes.hydration,
                whenToStopExercising: doc.importantNotes.whenToStopExercising,
            },
            equipmentNeeded: doc.equipmentNeeded,
            expectedResults: doc.expectedResults,
            isActive: doc.isActive,
            
        };
    }

    static toResponseDto(entity: WorkoutPlan): WorkoutPlanResponseDto {
        return {
            id: entity.id || '',
            userId: entity.userId,
            weeklyPlan: entity.weeklyPlan.map(day => ({
                day: day.day,
                focus: day.focus,
                isRestDay: day.isRestDay,
                warmup: day.warmup,
                mainWorkout: day.mainWorkout.map(ex => ({
                    exerciseName: ex.exerciseName,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: ex.rest,
                    notes: ex.notes,
                })),
                cooldown: day.cooldown,
            })),
            progressionGuidelines: entity.progressionaGuidelines, // Use the field from your entity
            importantNotes: entity.importantNotes,
            equipmentNeeded: entity.equipmentNeeded,
            expectedResults: entity.expectedResults,
            isActive: entity.isActive,
      
            // Convert Date object to ISO string for consistent API response
            //   createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : new Date().toISOString()
        };
    }
}