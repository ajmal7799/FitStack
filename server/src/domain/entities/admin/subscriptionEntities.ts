import { SubscriptionStatus } from "../../enum/subscriptionStatus"

export interface Subscription {
    _id: string,
    planName: string,
    price: number,
    durationMonths: number,
    description: string,
    isActive: SubscriptionStatus,
    createdAt: Date,
    updatedAt: Date
}