import { z } from 'zod';
import {
    UserGender,
    DietPreference,
    ExperienceLevel,
    FitnessGoal,
    WorkoutLocation,
} from '../../domain/enum/userProfileEnums';

export const userProfileSchema = z.object({
    userId: z.string().min(1, 'Invalid User ID.'),

    age: z
        .number()
        .int()
        .min(13, 'Age must be at least 13')
        .max(100, 'Invalid age'),

    gender: z.nativeEnum(UserGender),

    height: z
        .number()
        .min(50, 'Height must be in cm')
        .max(250),

    weight: z
        .number()
        .min(20)
        .max(300),

    fitnessGoal: z.nativeEnum(FitnessGoal),

    targetWeight: z
        .number()
        .min(20)
        .max(300),

    experienceLevel: z.nativeEnum(ExperienceLevel),

    workoutLocation: z.nativeEnum(WorkoutLocation),

    dietPreference: z
        .nativeEnum(DietPreference)
        .optional(),

    preferredWorkoutTypes: z
        .array(z.enum(['strength', 'cardio', 'flexibility', 'mixed']))
        .min(1, 'At least one workout type is required'),

    medicalConditions: z
        .array(z.string().min(2))
        .optional(),
});


export const userBodyMetricsSchema = userProfileSchema.partial();