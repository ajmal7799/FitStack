import { AdminSubscriptionController } from "../../../../interfaceAdapters/controller/admin/subscription/adminSubscriptionControllers";
import { SubscriptionRepository } from "../../../repositories/subscriptionRepository";
import { subscriptionModel } from "../../../database/models/subscriptionModel";
import { CreateSubscription } from "../../../../application/implementation/admin/subscription/createSubscription";
import { GetAllSubscription } from "../../../../application/implementation/admin/subscription/getAllSubscription";
import { UpdateSubscriptionStatus } from "../../../../application/implementation/admin/subscription/updateSubscriptionStatus";
import { StripeService } from "../../../services/StripeService";
// Repositories & Services
const subscriptionRepository = new SubscriptionRepository(subscriptionModel);
const stripeService = new StripeService();

// UseCases
const createSubscriptionUseCase = new CreateSubscription(subscriptionRepository, stripeService);
const getAllSubscriptionUseCase = new GetAllSubscription(subscriptionRepository);
const updateSubscriptionStatusUseCase = new UpdateSubscriptionStatus(subscriptionRepository);

// Controllers
export const adminSubscriptionController = new AdminSubscriptionController(createSubscriptionUseCase, getAllSubscriptionUseCase, updateSubscriptionStatusUseCase);