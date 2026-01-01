import { SubscriptionStatus } from '../../../../domain/enum/subscriptionStatus';

export interface SubscriptionDTO {
    _id: string;
    planName: string;
    price: number;
    durationMonths: number;
    description: string;
    isActive: SubscriptionStatus;
}


export interface ShowAcivePlanResponse {
    name:string;
    email:string;
    phone: number;
}