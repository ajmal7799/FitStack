// domain/interfaces/services/IStripePlanService.ts

export interface CreatePriceRecurring {
  interval: "month" | "year";
  interval_count: number;
}

export interface IStripeService {

    createProduct(name: string, description: string): Promise<string>;
    createPrice(productId: string, amount: number, recurring: CreatePriceRecurring): Promise<string>;
    createStripeCustomer(email: string, userId: string): Promise<string>;
}