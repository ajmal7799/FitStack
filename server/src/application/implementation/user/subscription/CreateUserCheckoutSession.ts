import { IStripeCheckoutService } from "../../../../domain/interfaces/services/IStripeCheckoutService";
import { ISubscriptionRepository } from "../../../../domain/interfaces/repositories/ISubscriptionRepository";
import { NotFoundException } from "../../../constants/exceptions";
import { SUBSCRIPTION_ERRORS, USER_ERRORS } from "../../../../shared/constants/error";
import { CheckoutSessionDTO } from "../../../dto/user/subscription/checkoutSessionDTO";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../../../domain/entities/user/userEntities";
import { IStripeService } from "../../../../domain/interfaces/services/IStripeService";

export class CreateUserCheckoutSession {
    constructor(
        
        private _subscriptionRepository: ISubscriptionRepository,
        private _userRepository: IUserRepository,
        private _checkoutService: IStripeCheckoutService,
        private _stripeService: IStripeService,
    ) {}


    private async ensureStripeCustomerId(user: User): Promise<string> {
        // If the ID already exists, use it.
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }

        // 1. Create Customer in Stripe (Infrastructure Service Call)
        // NOTE: We assume your IStripeCheckoutService has a method for this.
        const newCustomerId = await this._stripeService.createStripeCustomer(user.email, user._id!); 
        
        // 2. Save the new ID to the local User record immediately (CRITICAL)
        await this._userRepository.updateStripeCustomerId(user._id!, newCustomerId);
        
        return newCustomerId;
    }
  
    async execute(planId: string, userId: string): Promise<CheckoutSessionDTO> {
        
        // 1. Fetch the Plan from the Database using the local planId
       
        const plan = await this._subscriptionRepository.findById(planId);
        
        if (!plan) {
            throw new NotFoundException(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND); 
        }

        // 2. Validate essential Stripe ID
        const stripePriceId = plan.stripePriceId;
        const localPlanId = plan._id;
        if (!stripePriceId) {
            throw new  NotFoundException(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);
        }

        const user =  await this._userRepository.findById(userId);
        if(!user){
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }
        if(user.activeMembershipId) {
            throw new NotFoundException(SUBSCRIPTION_ERRORS.USER_ALREADY_HAS_ACTIVE_MEMBERSHIP);
        }

        

        const stripeCustomerId = await this.ensureStripeCustomerId(user);
        
        
        const sessionUrl = await this._checkoutService.createCheckoutSessionUrl(
            stripePriceId, 
            localPlanId,
            userId,
            stripeCustomerId,
        );

        return {
            sessionUrl,
        };
    }
}