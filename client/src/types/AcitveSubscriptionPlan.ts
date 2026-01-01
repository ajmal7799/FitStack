export interface SubscriptionResult {
  membershipId: string;
  userId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  planName: string;
  price: number;
  durationMonths: number;
  description: string;
  expiresAt: string;
  isExpired: boolean;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ActiveSubscriptionResponse = ApiResponse<{ result: SubscriptionResult }>;