
import { CreateWorkoutPlanResponseDTO } from '../../dto/user/workoutPlanDTO';
export interface IGenerateWorkoutPlanUseCase {
    generateWorkoutPlan(userId: string): Promise<CreateWorkoutPlanResponseDTO>;
}