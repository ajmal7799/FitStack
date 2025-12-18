import { UserProfile } from "../../entities/user/userProfile";

export interface IDietPlanProvider {
    generateDietPlan(profile: UserProfile): Promise<any>;
}
