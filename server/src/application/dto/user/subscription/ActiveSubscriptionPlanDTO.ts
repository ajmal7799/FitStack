
import { MembershipStatus } from '../../../../domain/enum/membershipEnums';
export interface ActiveSubscriptionPlanResponseDTO {
    membershipId: string;
    userId: string;
    planId: string;
    status: MembershipStatus,
    planName: string;
    price: number;
    durationMonths: number;
    description: string;
    expiresAt: Date; 
    isExpired: boolean;
}