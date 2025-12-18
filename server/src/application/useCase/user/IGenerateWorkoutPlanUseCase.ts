import { WorkoutPlanResponseDto } from "../../dto/user/workoutPlanDTO";
import { WorkoutPlan } from "../../../domain/entities/user/workoutPlanEntities";
import { CreateWorkoutPlanResponseDTO } from "../../dto/user/workoutPlanDTO";
export interface IGenerateWorkoutPlanUseCase {
    generateWorkoutPlan(userId: string): Promise<CreateWorkoutPlanResponseDTO>;
}