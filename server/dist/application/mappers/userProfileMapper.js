"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileMapper = void 0;
class UserProfileMapper {
    static fromMongooseDocument(doc) {
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            age: doc.age,
            gender: doc.gender,
            height: doc.height,
            weight: doc.weight,
            fitnessGoal: doc.fitnessGoal,
            targetWeight: doc.targetWeight,
            dietPreference: doc.dietPreference,
            experienceLevel: doc.experienceLevel,
            workoutLocation: doc.workoutLocation,
            preferredWorkoutTypes: doc.preferredWorkoutTypes,
            medicalConditions: doc.medicalConditions,
            profileCompleted: doc.profileCompleted,
        };
    }
    static mapToGetUserProfileDTO(doc) {
        return {
            userId: doc.userId,
            age: doc.age,
            gender: doc.gender,
            height: doc.height,
            weight: doc.weight,
            fitnessGoal: doc.fitnessGoal,
            targetWeight: doc.targetWeight,
            dietPreference: doc.dietPreference,
            experienceLevel: doc.experienceLevel,
            workoutLocation: doc.workoutLocation,
            preferredWorkoutTypes: doc.preferredWorkoutTypes,
            medicalConditions: doc.medicalConditions,
            profileCompleted: doc.profileCompleted,
        };
    }
}
exports.UserProfileMapper = UserProfileMapper;
