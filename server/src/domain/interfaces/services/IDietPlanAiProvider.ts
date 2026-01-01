import { UserProfile } from '../../entities/user/userProfile';
import { DietPlan } from '../../entities/user/dietPlanEntities';

export interface IDietPlanProvider {
    generateDietPlan(profile: UserProfile): Promise<DietPlan|null>;
}
