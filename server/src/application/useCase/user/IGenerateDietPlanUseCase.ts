import { CreatedietPlanDTO } from "../../dto/user/dietPlanDTO"

export interface IGenerateDietPlanUseCase {
    generateDietPlan(userId: string): Promise<CreatedietPlanDTO>
}