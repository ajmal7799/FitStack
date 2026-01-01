
import { DietPlanResponseDto } from '../../dto/user/dietPlanDTO';

export interface IGetDietPlanUseCase {
    excute(userId: string): Promise<DietPlanResponseDto>
}