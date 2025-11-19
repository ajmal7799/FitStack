import mongoose from "mongoose";
import {
    UserGender,
    UserRole,
    UserStatus,
    FitnessGoal,
    ExperienceLevel,
    DietPreference,
    WorkoutType
} from "../../../domain/enum/userEnums";

const userSchema = new mongoose.Schema(
    {
        // Auth fields
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
            // select: false
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        isActive: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
        },

        // // Basic Info
        // profileImage: { // ← Add this
        //     type: String,
        //     required: false,
        //     default: null
        // },

        // dateOfBirth: {
        //     type: Date,
        //     required: false
        // },
        // gender: {
        //     type: String,
        //     enum: Object.values(UserGender),
        //     required: false
        // },
        // height: {
        //     type: Number,
        //     required: false,
        //     min: 0
        // },
        // weight: {
        //     type: Number,
        //     required: false,
        //     min: 0
        // },
        // targetWeight: {
        //     type: Number,
        //     required: false,
        //     min: 0
        // },

        // // Fitness Info
        // fitnessGoal: {
        //     type: String,
        //     enum: Object.values(FitnessGoal),
        //     required: false
        // },
        // experienceLevel: {
        //     type: String,
        //     enum: Object.values(ExperienceLevel),
        //     required: false
        // },
        // preferredWorkoutType: [{
        //     type: String,
        //     enum: Object.values(WorkoutType)
        // }],

        // // Health & Diet
        // medicalConditions: [{
        //     type: String
        // }],
        // dietPreference: {
        //     type: String,
        //     enum: Object.values(DietPreference),
        //     required: false
        // },

        // // Goals & Tracking
        // waterIntakeGoal: {
        //     type: Number,
        //     required: false,
        //     min: 0
        // },

        // // Tracking
        // profileCompleted: {
        //     type: Boolean,
        //     default: false
        // }
    },
    { timestamps: true }
);

export default userSchema;
