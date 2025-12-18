import { UserProfile } from "../../entities/user/userProfile";
import { WorkoutPlan } from "../../entities/user/workoutPlanEntities";
export interface IWorkoutAIProvider {
    generatePlan(profile: UserProfile): Promise<WorkoutPlan|null>;
}