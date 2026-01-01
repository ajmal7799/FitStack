"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBodyMetricsSchema = exports.userProfileSchema = void 0;
const zod_1 = require("zod");
const userProfileEnums_1 = require("../../domain/enum/userProfileEnums");
exports.userProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'Invalid User ID.'),
    age: zod_1.z
        .number()
        .int()
        .min(13, 'Age must be at least 13')
        .max(100, 'Invalid age'),
    gender: zod_1.z.nativeEnum(userProfileEnums_1.UserGender),
    height: zod_1.z
        .number()
        .min(50, 'Height must be in cm')
        .max(250),
    weight: zod_1.z
        .number()
        .min(20)
        .max(300),
    fitnessGoal: zod_1.z.nativeEnum(userProfileEnums_1.FitnessGoal),
    targetWeight: zod_1.z
        .number()
        .min(20)
        .max(300),
    experienceLevel: zod_1.z.nativeEnum(userProfileEnums_1.ExperienceLevel),
    workoutLocation: zod_1.z.nativeEnum(userProfileEnums_1.WorkoutLocation),
    dietPreference: zod_1.z
        .nativeEnum(userProfileEnums_1.DietPreference)
        .optional(),
    preferredWorkoutTypes: zod_1.z
        .array(zod_1.z.enum(['strength', 'cardio', 'flexibility', 'mixed']))
        .min(1, 'At least one workout type is required'),
    medicalConditions: zod_1.z
        .array(zod_1.z.string().min(2))
        .optional(),
});
exports.userBodyMetricsSchema = exports.userProfileSchema.partial();
