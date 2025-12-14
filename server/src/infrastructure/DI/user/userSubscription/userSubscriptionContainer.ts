import { UserSubscriptionController } from "../../../../interfaceAdapters/controller/user/userSubscriptionController";
import { GetAllSubscriptionUser } from "../../../../application/implementation/user/subscription/GetAllSubscription";
import { SubscriptionRepository } from "../../../repositories/subscriptionRepository";
import { subscriptionModel } from "../../../database/models/subscriptionModel";
import { CreateUserCheckoutSession } from "../../../../application/implementation/user/subscription/CreateUserCheckoutSession";
import { StripeService } from "../../../services/StripeService";
import { UserRepository } from "../../../repositories/userRepository";
import { userModel } from "../../../database/models/userModel";
import { HandleWebhookUseCase } from "../../../../application/implementation/user/subscription/handleWebhookUseCase";
import { MembershipRepository } from "../../../repositories/membershipRepository";
import { membershipModel } from "../../../database/models/membershipModel";


// repository & service
const subscriptionRepository = new SubscriptionRepository(subscriptionModel);
const stripeService = new StripeService();
const userRepository = new UserRepository(userModel);
const membershipRepository = new MembershipRepository(membershipModel);

// usecase
const getAllSubscriptionUseCase = new GetAllSubscriptionUser(subscriptionRepository);
const createUserCheckoutSessionUseCase = new CreateUserCheckoutSession(subscriptionRepository,userRepository, stripeService, stripeService);
const webhookHandler = new HandleWebhookUseCase(userRepository, stripeService, membershipRepository);

// controller
export const userSubscriptionController = new UserSubscriptionController(getAllSubscriptionUseCase, createUserCheckoutSessionUseCase, webhookHandler);