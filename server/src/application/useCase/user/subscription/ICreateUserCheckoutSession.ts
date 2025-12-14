import { CheckoutSessionDTO } from "../../../dto/user/subscription/checkoutSessionDTO";

export interface ICreateUserCheckoutSession {
    execute(planId: string, userId: string): Promise<CheckoutSessionDTO>;
}