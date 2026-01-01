import { required } from 'zod/mini';
import {
    UserGender,
    DietPreference,
    ExperienceLevel,
    FitnessGoal,
    PreferredWorkoutType,
} from '../../../domain/enum/userProfileEnums';
import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },

    age: { type: Number, required: true },

    gender: { type: String, enum: Object.values(UserGender), required: true },

    height: { type: Number, required: true },

    weight: { type: Number, required: true },

    

    fitnessGoal: { type: String, enum: Object.values(FitnessGoal), required: true },

    targetWeight: { type: Number, required: true },

    dietPreference: { type: String, enum: Object.values(DietPreference), default: null },

    experienceLevel: { type: String, enum: Object.values(ExperienceLevel), required: true },

    workoutLocation: { type: String, enum: Object.values(PreferredWorkoutType), required: true },

    preferredWorkoutTypes: { type: [String],  required: true },

    medicalConditions: { type: [String], default: [] },

    profileCompleted: { type: Boolean, default: false },

},
{ timestamps: true },
);


export default userProfileSchema;
