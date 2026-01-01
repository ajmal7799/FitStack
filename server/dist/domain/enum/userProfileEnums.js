"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutLocation = exports.DietPreference = exports.PreferredWorkoutType = exports.ExperienceLevel = exports.FitnessGoal = exports.UserGender = void 0;
var UserGender;
(function (UserGender) {
    UserGender["MALE"] = "male";
    UserGender["FEMALE"] = "female";
    UserGender["OTHER"] = "other";
})(UserGender || (exports.UserGender = UserGender = {}));
var FitnessGoal;
(function (FitnessGoal) {
    FitnessGoal["LOSE_WEIGHT"] = "lose weight";
    FitnessGoal["BUILD_MUSCLE"] = "gain muscle";
    FitnessGoal["MAINTAIN_FITNESS"] = "maintain fitness";
    FitnessGoal["IMPROVE_ENDURANCE"] = "improve endurance";
    FitnessGoal["FLEXIBILITY"] = "flexibility";
    FitnessGoal["GENERAL_HEALTH"] = "general health";
})(FitnessGoal || (exports.FitnessGoal = FitnessGoal = {}));
var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["BEGINNER"] = "beginner";
    ExperienceLevel["INTERMEDIATE"] = "intermediate";
    ExperienceLevel["ADVANCED"] = "advanced";
})(ExperienceLevel || (exports.ExperienceLevel = ExperienceLevel = {}));
var PreferredWorkoutType;
(function (PreferredWorkoutType) {
    PreferredWorkoutType["strength"] = "strength";
    PreferredWorkoutType["cardio"] = "cardio";
    PreferredWorkoutType["flexibility"] = "flexibility";
    PreferredWorkoutType["mixed"] = "mixed";
})(PreferredWorkoutType || (exports.PreferredWorkoutType = PreferredWorkoutType = {}));
var DietPreference;
(function (DietPreference) {
    DietPreference["VEGAN"] = "vegan";
    DietPreference["VEGETARIAN"] = "vegetarian";
    DietPreference["OMNIVORE"] = "omnivore";
    DietPreference["OTHER"] = "other";
})(DietPreference || (exports.DietPreference = DietPreference = {}));
var WorkoutLocation;
(function (WorkoutLocation) {
    WorkoutLocation["GYM"] = "gym";
    WorkoutLocation["HOME"] = "home";
})(WorkoutLocation || (exports.WorkoutLocation = WorkoutLocation = {}));
