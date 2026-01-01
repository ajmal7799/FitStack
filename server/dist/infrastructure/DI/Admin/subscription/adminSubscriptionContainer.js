"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSubscriptionController = void 0;
const adminSubscriptionControllers_1 = require("../../../../interfaceAdapters/controller/admin/subscription/adminSubscriptionControllers");
const subscriptionRepository_1 = require("../../../repositories/subscriptionRepository");
const subscriptionModel_1 = require("../../../database/models/subscriptionModel");
const createSubscription_1 = require("../../../../application/implementation/admin/subscription/createSubscription");
const getAllSubscription_1 = require("../../../../application/implementation/admin/subscription/getAllSubscription");
const updateSubscriptionStatus_1 = require("../../../../application/implementation/admin/subscription/updateSubscriptionStatus");
const StripeService_1 = require("../../../services/StripeService");
const userRepository_1 = require("../../../repositories/userRepository");
const userModel_1 = require("../../../database/models/userModel");
const getSubscriptionEdit_1 = require("../../../../application/implementation/admin/subscription/getSubscriptionEdit");
const updateSubscription_1 = require("../../../../application/implementation/admin/subscription/updateSubscription");
// Repositories & Services
const subscriptionRepository = new subscriptionRepository_1.SubscriptionRepository(subscriptionModel_1.subscriptionModel);
const stripeService = new StripeService_1.StripeService();
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
// UseCases
const createSubscriptionUseCase = new createSubscription_1.CreateSubscription(subscriptionRepository, stripeService);
const getAllSubscriptionUseCase = new getAllSubscription_1.GetAllSubscription(subscriptionRepository);
const updateSubscriptionStatusUseCase = new updateSubscriptionStatus_1.UpdateSubscriptionStatus(subscriptionRepository);
const getSubscriptionEditPageUseCase = new getSubscriptionEdit_1.GetSubscriptionEditPage(subscriptionRepository);
const updateSubscriptionUseCase = new updateSubscription_1.UpdateSubscription(subscriptionRepository, stripeService);
// Controllers
exports.adminSubscriptionController = new adminSubscriptionControllers_1.AdminSubscriptionController(createSubscriptionUseCase, getAllSubscriptionUseCase, updateSubscriptionStatusUseCase, getSubscriptionEditPageUseCase, updateSubscriptionUseCase);
