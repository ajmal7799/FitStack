import { AdminSubscriptionController } from '../../../../interfaceAdapters/controller/admin/subscription/adminSubscriptionControllers';
import { SubscriptionRepository } from '../../../repositories/subscriptionRepository';
import { subscriptionModel } from '../../../database/models/subscriptionModel';
import { CreateSubscription } from '../../../../application/implementation/admin/subscription/createSubscription';
import { GetAllSubscription } from '../../../../application/implementation/admin/subscription/getAllSubscription';
import { UpdateSubscriptionStatus } from '../../../../application/implementation/admin/subscription/updateSubscriptionStatus';
import { StripeService } from '../../../services/StripeService';
import { UserRepository } from '../../../repositories/userRepository';
import { userModel } from '../../../database/models/userModel';
import { GetSubscriptionEditPage } from '../../../../application/implementation/admin/subscription/getSubscriptionEdit';
import { UpdateSubscription } from '../../../../application/implementation/admin/subscription/updateSubscription';

// Repositories & Services
const subscriptionRepository = new SubscriptionRepository(subscriptionModel);
const stripeService = new StripeService();
const userRepository = new UserRepository(userModel);

// UseCases
const createSubscriptionUseCase = new CreateSubscription(subscriptionRepository, stripeService);
const getAllSubscriptionUseCase = new GetAllSubscription(subscriptionRepository);
const updateSubscriptionStatusUseCase = new UpdateSubscriptionStatus(subscriptionRepository);
const getSubscriptionEditPageUseCase = new GetSubscriptionEditPage(subscriptionRepository);
const updateSubscriptionUseCase = new UpdateSubscription(subscriptionRepository, stripeService);


// Controllers
export const adminSubscriptionController = new AdminSubscriptionController(
    createSubscriptionUseCase,
    getAllSubscriptionUseCase,
    updateSubscriptionStatusUseCase,
    getSubscriptionEditPageUseCase,
    updateSubscriptionUseCase
    
);