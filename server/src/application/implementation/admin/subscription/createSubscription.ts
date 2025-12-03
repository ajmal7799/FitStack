import { Subscription } from "../../../../domain/entities/admin/subscriptionEntities";
import { CreateSubscriptionDTO } from "../../../dto/admin/subscription/createSubscriptionDTO";
import { ICreateSubscription } from "../../../useCase/admin/subscription/ICreateSubscription";
import { ISubscriptionRepository } from "../../../../domain/interfaces/repositories/ISubscriptionRepository";
import { AlreadyExisitingExecption } from "../../../constants/exceptions";
import { SUBSCRIPTION_ERRORS } from "../../../../shared/constants/error";
import { SubscriptionMapper } from "../../../mappers/subscriptionMappers";

export class CreateSubscription implements ICreateSubscription {
    constructor(
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async createSubscription(data: CreateSubscriptionDTO): Promise<Subscription> {
        const subscription = await this._subscriptionRepository.findByName(data.planName);
        if (subscription) {
            throw new AlreadyExisitingExecption(SUBSCRIPTION_ERRORS.SUBSCRIPTION_ALREADY_EXISTS);
        }

        const subscriptionData = SubscriptionMapper.toEntity(data);

        const newSubscription = await this._subscriptionRepository.save(subscriptionData);
        return newSubscription;
        
    }

}