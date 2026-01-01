import { UserGenerateWorkoutplanController } from '../../../interfaceAdapters/controller/user/userGenerateWorkoutplanController';
import { UserProfileRepository } from '../../repositories/userProfileRepository';
import { GeminiWorkoutProvider } from '../../services/GeminiWorkoutProvider';
import { userProfileModel } from '../../database/models/userProfileModel';
import { GenerateWorkoutPlanUseCase } from '../../../application/implementation/user/GenerateWorkoutPlanUseCase';
import { WorkoutPlanRepository } from '../../repositories/workouPlanRepository';
import { workoutPlanModel } from '../../database/models/workoutPlanModel';
import { UserGenerateDietPlanController } from '../../../interfaceAdapters/controller/user/userGenerateDietPlanController';
import { GenerateDietPlanUseCase } from '../../../application/implementation/user/GenerateDietPlanUseCase';
import { GeminiDietProvider } from '../../services/GeminiDietPlanProvider';
import { DietPlanRepository } from '../../repositories/dietPlanRepository';
import { DietPlanModel } from '../../database/models/dietPlanModel';
import { GetWorkoutPlanUseCase } from '../../../application/implementation/user/GetWorkoutPlanUseCase';
import { UserRepository } from '../../repositories/userRepository';
import { userModel } from '../../database/models/userModel';
import { GetDietPlanUseCase } from '../../../application/implementation/user/GetDietPlanUseCase';

// Repositories & Services
const userProfileRepository = new UserProfileRepository(userProfileModel);
const userRepository = new UserRepository(userModel);
const workoutAIProvider = new GeminiWorkoutProvider();
const workoutPlanRepository = new WorkoutPlanRepository(workoutPlanModel);

const dietPlanRepository = new DietPlanRepository(DietPlanModel);

const dietPlanProvider = new GeminiDietProvider(); 

// useCases
const generateWorkoutPlanUseCase = new GenerateWorkoutPlanUseCase(userProfileRepository, workoutAIProvider, workoutPlanRepository);
const getWorkoutPlanUseCase = new GetWorkoutPlanUseCase(workoutPlanRepository, userRepository);

const generateDietPlanUseCase = new GenerateDietPlanUseCase(userProfileRepository, dietPlanProvider, dietPlanRepository);
const getDietPlanUseCase = new GetDietPlanUseCase(userRepository, dietPlanRepository);
// controllers
export const userGenerateWorkoutplanController = new UserGenerateWorkoutplanController( 
    generateWorkoutPlanUseCase,
    getWorkoutPlanUseCase,

);

export const userGenerateDietplanController = new UserGenerateDietPlanController(generateDietPlanUseCase, getDietPlanUseCase);