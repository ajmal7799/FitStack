import { Subscription } from "../../../../domain/entities/admin/subscriptionEntities";
import { CreateSubscriptionDTO } from "../../../dto/admin/subscription/createSubscriptionDTO";
import { ICreateSubscription } from "../../../useCase/admin/subscription/ICreateSubscription";
import { ISubscriptionRepository } from "../../../../domain/interfaces/repositories/ISubscriptionRepository";
import { AlreadyExisitingExecption } from "../../../constants/exceptions";
import { SUBSCRIPTION_ERRORS } from "../../../../shared/constants/error";
import { SubscriptionMapper } from "../../../mappers/subscriptionMappers";
import { IStripeService } from "../../../../domain/interfaces/services/IStripeService";
// 🆕 Assume you've created this interface in your domain/application layer
// export interface IStripeService {
//     createProduct(name: string, description: string): Promise<string>; 
//     createPrice(productId: string, amount: number, interval: 'month' | 'year'): Promise<string>;
// }

export class CreateSubscription implements ICreateSubscription {
    constructor(
        private _subscriptionRepository: ISubscriptionRepository,
        // 🆕 Inject the Stripe Service dependency
        private _stripeService: IStripeService 
    ) {}

    async createSubscription(data: CreateSubscriptionDTO): Promise<Subscription> {
        const subscription = await this._subscriptionRepository.findByName(data.planName);
        if (subscription) {
            throw new AlreadyExisitingExecption(SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
        }

        
        const description = data.description || `Plan: ${data.planName}`;
        const stripeProductId = await this._stripeService.createProduct(data.planName, description);

      
        const priceInCents = Math.round(data.price * 100); 
       
        
        
        const stripePriceId = await this._stripeService.createPrice(
            stripeProductId, 
            priceInCents, 
            {
                interval: "month",
                interval_count: data.durationMonths
            }
        );

        // 3. 💾 Map and Save to DB (Including new IDs)
        // Add the new Stripe IDs to the data before mapping to the entity
        const subscriptionData = SubscriptionMapper.toEntity({
            ...data, 
            stripeProductId,
            stripePriceId
        });

        const newSubscription = await this._subscriptionRepository.save(subscriptionData);
        return newSubscription;
    }
}