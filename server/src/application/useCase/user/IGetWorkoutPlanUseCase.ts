import { WorkoutPlanResponseDto } from "../../dto/user/workoutPlanDTO";
export interface IGetWorkoutPlanUseCase {
    execute(userId: string ): Promise<WorkoutPlanResponseDto>;
}