export enum WalletTransactionType {
    REFUND = 'REFUND',                      // user gets refund on cancellation
    SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT', // user pays via wallet
    SESSION_COMMISSION = 'SESSION_COMMISSION',  // trainer earns from session
    PLATFORM_FEE = 'PLATFORM_FEE',          // admin earns from session
}