"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const userProfileEnums_1 = require("../../domain/enum/userProfileEnums");
exports.updateProfileSchema = zod_1.z.object({
    profileImage: zod_1.z.string().url().optional(),
    dateOfBirth: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    gender: zod_1.z.enum([
        userProfileEnums_1.UserGender.MALE,
        userProfileEnums_1.UserGender.FEMALE,
        userProfileEnums_1.UserGender.OTHER,
    ]).optional(),
    height: zod_1.z.number().min(50).max(300).optional(),
    weight: zod_1.z.number().min(20).max(500).optional(),
    targetWeight: zod_1.z.number().min(20).max(500).optional(),
    fitnessGoal: zod_1.z.enum([
        userProfileEnums_1.FitnessGoal.LOSE_WEIGHT,
        userProfileEnums_1.FitnessGoal.BUILD_MUSCLE,
        userProfileEnums_1.FitnessGoal.MAINTAIN_FITNESS,
        userProfileEnums_1.FitnessGoal.IMPROVE_ENDURANCE,
        userProfileEnums_1.FitnessGoal.FLEXIBILITY,
        userProfileEnums_1.FitnessGoal.GENERAL_HEALTH,
    ]).optional(),
    experienceLevel: zod_1.z.enum([
        userProfileEnums_1.ExperienceLevel.BEGINNER,
        userProfileEnums_1.ExperienceLevel.INTERMEDIATE,
        userProfileEnums_1.ExperienceLevel.ADVANCED,
    ]).optional(),
    preferredWorkoutType: zod_1.z.array(zod_1.z.enum([
        userProfileEnums_1.PreferredWorkoutType.strength,
        userProfileEnums_1.PreferredWorkoutType.cardio,
        userProfileEnums_1.PreferredWorkoutType.flexibility,
        userProfileEnums_1.PreferredWorkoutType.mixed,
        // WorkoutType.PILATES,
        // WorkoutType.CROSSFIT,
        // WorkoutType.BODYWEIGHT,
        // WorkoutType.FUNCTIONAL,
        // WorkoutType.SPORTS,
        // WorkoutType.MIXED,
    ])).optional(),
    medicalConditions: zod_1.z.array(zod_1.z.string()).optional(),
    dietPreference: zod_1.z.enum([
        userProfileEnums_1.DietPreference.VEGETARIAN,
        userProfileEnums_1.DietPreference.VEGAN,
        userProfileEnums_1.DietPreference.OMNIVORE,
        // DietPreference.KETO,
        // DietPreference.PALEO,
        // DietPreference.BALANCED,
        userProfileEnums_1.DietPreference.OTHER,
    ]).optional(),
    waterIntakeGoal: zod_1.z.number().min(0).max(20).optional(),
});
