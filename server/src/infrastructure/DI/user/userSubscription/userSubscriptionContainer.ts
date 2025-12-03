import { UserSubscriptionController } from "../../../../interfaceAdapters/controller/user/userSubscriptionController";
import { GetAllSubscriptionUser } from "../../../../application/implementation/user/subscription/GetAllSubscription";
import { SubscriptionRepository } from "../../../repositories/subscriptionRepository";
import { subscriptionModel } from "../../../database/models/subscriptionModel";

// repository & service
const subscriptionRepository = new SubscriptionRepository(subscriptionModel);

// usecase
const getAllSubscriptionUseCase = new GetAllSubscriptionUser(subscriptionRepository);

// controller
export const userSubscriptionController = new UserSubscriptionController(getAllSubscriptionUseCase);