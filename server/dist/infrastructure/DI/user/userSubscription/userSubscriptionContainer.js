"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSubscriptionController = void 0;
const userSubscriptionController_1 = require("../../../../interfaceAdapters/controller/user/userSubscriptionController");
const GetAllSubscription_1 = require("../../../../application/implementation/user/subscription/GetAllSubscription");
const subscriptionRepository_1 = require("../../../repositories/subscriptionRepository");
const subscriptionModel_1 = require("../../../database/models/subscriptionModel");
const CreateUserCheckoutSession_1 = require("../../../../application/implementation/user/subscription/CreateUserCheckoutSession");
const StripeService_1 = require("../../../services/StripeService");
const userRepository_1 = require("../../../repositories/userRepository");
const userModel_1 = require("../../../database/models/userModel");
const handleWebhookUseCase_1 = require("../../../../application/implementation/user/subscription/handleWebhookUseCase");
const membershipRepository_1 = require("../../../repositories/membershipRepository");
const membershipModel_1 = require("../../../database/models/membershipModel");
const ActiveSubscriptionUseCase_1 = require("../../../../application/implementation/user/subscription/ActiveSubscriptionUseCase");
// repository & service
const subscriptionRepository = new subscriptionRepository_1.SubscriptionRepository(subscriptionModel_1.subscriptionModel);
const stripeService = new StripeService_1.StripeService();
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const membershipRepository = new membershipRepository_1.MembershipRepository(membershipModel_1.membershipModel);
// usecase
const getAllSubscriptionUseCase = new GetAllSubscription_1.GetAllSubscriptionUser(subscriptionRepository);
const createUserCheckoutSessionUseCase = new CreateUserCheckoutSession_1.CreateUserCheckoutSession(subscriptionRepository, userRepository, stripeService, stripeService);
const webhookHandler = new handleWebhookUseCase_1.HandleWebhookUseCase(userRepository, stripeService, membershipRepository);
const activeSubscriptionUseCase = new ActiveSubscriptionUseCase_1.ActiveSubscriptionUseCase(subscriptionRepository, userRepository, membershipRepository);
// controller
exports.userSubscriptionController = new userSubscriptionController_1.UserSubscriptionController(getAllSubscriptionUseCase, createUserCheckoutSessionUseCase, webhookHandler, activeSubscriptionUseCase);
