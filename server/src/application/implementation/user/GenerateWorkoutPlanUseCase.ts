import { IGenerateWorkoutPlanUseCase } from "../../useCase/user/IGenerateWorkoutPlanUseCase";
import { IUserProfileRepository } from "../../../domain/interfaces/repositories/IUserProfileRepository";
import { InvalidDataException, NotFoundException } from "../../constants/exceptions";
import { USER_ERRORS } from "../../../shared/constants/error";
import { IWorkoutAIProvider } from "../../../domain/interfaces/services/IWorkoutAIProvider";
import { IWorkoutPlanRepository } from "../../../domain/interfaces/repositories/IWorkoutPlanRepository";
import { CreateWorkoutPlanResponseDTO } from "../../dto/user/workoutPlanDTO";

export class GenerateWorkoutPlanUseCase implements IGenerateWorkoutPlanUseCase {
    constructor(
        private _userProfileRepository: IUserProfileRepository,
        private _workoutAIProvider: IWorkoutAIProvider,
        private _workoutPlanRepository: IWorkoutPlanRepository

    ) {}

    async generateWorkoutPlan(userId: string): Promise<CreateWorkoutPlanResponseDTO> {

        const userProfile = await this._userProfileRepository.findByUserId(userId);

        if(!userProfile) {
            throw new NotFoundException(USER_ERRORS.USER_PROFILE_NOT_FOUND);
        }

        const plan = await this._workoutAIProvider.generatePlan(userProfile);
            
        if(!plan) {
            throw new InvalidDataException(USER_ERRORS.USER_GENERATE_WORKOUT_PLAN_FAILED);
        }

        const workoutPlan = await this._workoutPlanRepository.saveWorkoutPlan(userId, plan);

        if(!workoutPlan) {
            throw new InvalidDataException(USER_ERRORS.USER_GENERATE_WORKOUT_PLAN_FAILED);
        }

        return {
            workoutPlan
        } as CreateWorkoutPlanResponseDTO

    }
}