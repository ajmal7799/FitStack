export interface CheckoutSessionDTO {
    sessionUrl?: string;         // Stripe checkout URL (if Stripe payment needed)
    paidWithWallet?: boolean;    // true if fully paid with wallet
    amountDeducted?: number; 

}