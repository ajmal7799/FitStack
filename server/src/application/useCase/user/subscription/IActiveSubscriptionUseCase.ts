
import { ActiveSubscriptionPlanResponseDTO } from '../../../dto/user/subscription/ActiveSubscriptionPlanDTO';

export interface IActiveSubscriptionUseCase {
    showActiveSubscription(userId: string): Promise<ActiveSubscriptionPlanResponseDTO | null>;
}