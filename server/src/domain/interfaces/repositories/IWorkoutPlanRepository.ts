import { WorkoutPlan } from "../../entities/user/workoutPlanEntities";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkoutPlanRepository extends IBaseRepository<WorkoutPlan> {
   findByUserId(userId: string): Promise<WorkoutPlan | null>
    saveWorkoutPlan(userId: string, data: Partial<WorkoutPlan>): Promise<WorkoutPlan | null>
}