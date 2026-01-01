import { IBaseRepository } from './IBaseRepository';
import { DietPlan } from '../../entities/user/dietPlanEntities';


export interface IDietPlanRepository extends IBaseRepository<DietPlan> {
    findByUserId(userId: string): Promise<DietPlan | null>
    saveDietPlan(userId:string, data: Partial<DietPlan>): Promise<DietPlan | null>
}