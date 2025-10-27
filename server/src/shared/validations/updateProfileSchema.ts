import { z } from "zod";
import { UserGender, FitnessGoal, ExperienceLevel, DietPreference, WorkoutType } from '../../domain/enum/userEnums'

export const updateProfileSchema = z.object({
    
    profileImage: z.string().url().optional(),
    
    dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
    
    gender: z.enum([
        UserGender.MALE, 
        UserGender.FEMALE, 
        UserGender.OTHER
    ]).optional(),
    
    height: z.number().min(50).max(300).optional(), 
    
    weight: z.number().min(20).max(500).optional(), 
    
    targetWeight: z.number().min(20).max(500).optional(),
    
   
    fitnessGoal: z.enum([
        FitnessGoal.LOSE_WEIGHT,
        FitnessGoal.BUILD_MUSCLE,
        FitnessGoal.MAINTAIN_FITNESS,
        FitnessGoal.IMPROVE_ENDURANCE,
        FitnessGoal.FLEXIBILITY,
        FitnessGoal.GENERAL_HEALTH
    ]).optional(),
    
    experienceLevel: z.enum([
        ExperienceLevel.BEGINNER,
        ExperienceLevel.INTERMEDIATE,
        ExperienceLevel.ADVANCED
    ]).optional(),
    
    preferredWorkoutType: z.array(z.enum([
        WorkoutType.STRENGTH,
        WorkoutType.CARDIO,
        WorkoutType.HIIT,
        WorkoutType.YOGA,
        WorkoutType.PILATES,
        WorkoutType.CROSSFIT,
        WorkoutType.BODYWEIGHT,
        WorkoutType.FUNCTIONAL,
        WorkoutType.SPORTS,
        WorkoutType.MIXED
    ])).optional(),
    
    
    medicalConditions: z.array(z.string()).optional(),
    
    dietPreference: z.enum([
        DietPreference.VEGETARIAN,
        DietPreference.VEGAN,
        DietPreference.NON_VEGETARIAN,
        DietPreference.KETO,
        DietPreference.PALEO,
        DietPreference.BALANCED,
        DietPreference.OTHER
    ]).optional(),
    
  
    waterIntakeGoal: z.number().min(0).max(20).optional() 
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
