"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGenerateDietplanController = exports.userGenerateWorkoutplanController = void 0;
const userGenerateWorkoutplanController_1 = require("../../../interfaceAdapters/controller/user/userGenerateWorkoutplanController");
const userProfileRepository_1 = require("../../repositories/userProfileRepository");
const GeminiWorkoutProvider_1 = require("../../services/GeminiWorkoutProvider");
const userProfileModel_1 = require("../../database/models/userProfileModel");
const GenerateWorkoutPlanUseCase_1 = require("../../../application/implementation/user/GenerateWorkoutPlanUseCase");
const workouPlanRepository_1 = require("../../repositories/workouPlanRepository");
const workoutPlanModel_1 = require("../../database/models/workoutPlanModel");
const userGenerateDietPlanController_1 = require("../../../interfaceAdapters/controller/user/userGenerateDietPlanController");
const GenerateDietPlanUseCase_1 = require("../../../application/implementation/user/GenerateDietPlanUseCase");
const GeminiDietPlanProvider_1 = require("../../services/GeminiDietPlanProvider");
const dietPlanRepository_1 = require("../../repositories/dietPlanRepository");
const dietPlanModel_1 = require("../../database/models/dietPlanModel");
const GetWorkoutPlanUseCase_1 = require("../../../application/implementation/user/GetWorkoutPlanUseCase");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const GetDietPlanUseCase_1 = require("../../../application/implementation/user/GetDietPlanUseCase");
// Repositories & Services
const userProfileRepository = new userProfileRepository_1.UserProfileRepository(userProfileModel_1.userProfileModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const workoutAIProvider = new GeminiWorkoutProvider_1.GeminiWorkoutProvider();
const workoutPlanRepository = new workouPlanRepository_1.WorkoutPlanRepository(workoutPlanModel_1.workoutPlanModel);
const dietPlanRepository = new dietPlanRepository_1.DietPlanRepository(dietPlanModel_1.DietPlanModel);
const dietPlanProvider = new GeminiDietPlanProvider_1.GeminiDietProvider();
// useCases
const generateWorkoutPlanUseCase = new GenerateWorkoutPlanUseCase_1.GenerateWorkoutPlanUseCase(userProfileRepository, workoutAIProvider, workoutPlanRepository);
const getWorkoutPlanUseCase = new GetWorkoutPlanUseCase_1.GetWorkoutPlanUseCase(workoutPlanRepository, userRepository);
const generateDietPlanUseCase = new GenerateDietPlanUseCase_1.GenerateDietPlanUseCase(userProfileRepository, dietPlanProvider, dietPlanRepository);
const getDietPlanUseCase = new GetDietPlanUseCase_1.GetDietPlanUseCase(userRepository, dietPlanRepository);
// controllers
exports.userGenerateWorkoutplanController = new userGenerateWorkoutplanController_1.UserGenerateWorkoutplanController(generateWorkoutPlanUseCase, getWorkoutPlanUseCase);
exports.userGenerateDietplanController = new userGenerateDietPlanController_1.UserGenerateDietPlanController(generateDietPlanUseCase, getDietPlanUseCase);
