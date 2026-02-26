import { UserSubscriptionController } from '../../../../interfaceAdapters/controller/user/userSubscriptionController';
import { GetAllSubscriptionUser } from '../../../../application/implementation/user/subscription/GetAllSubscription';
import { SubscriptionRepository } from '../../../repositories/subscriptionRepository';
import { subscriptionModel } from '../../../database/models/subscriptionModel';
import { CreateUserCheckoutSession } from '../../../../application/implementation/user/subscription/CreateUserCheckoutSession';
import { StripeService } from '../../../services/StripeService';
import { UserRepository } from '../../../repositories/userRepository';
import { userModel } from '../../../database/models/userModel';
import { HandleWebhookUseCase } from '../../../../application/implementation/user/subscription/handleWebhookUseCase';
import { MembershipRepository } from '../../../repositories/membershipRepository';
import { membershipModel } from '../../../database/models/membershipModel';
import { ActiveSubscriptionUseCase } from '../../../../application/implementation/user/subscription/ActiveSubscriptionUseCase';
import { NonSubscribedUsersUseCase } from '../../../../application/implementation/user/subscription/NonSubscribedUsersUseCase';
import { ProcessExpiredSubscriptionsUseCase } from '../../../../application/implementation/user/subscription/ProcessExpiredSubscriptionsUseCase';
import { CreateNotification } from '../../../../application/implementation/notification/CreateNotification';
import { NotificationRepository } from '../../../repositories/notificationRepository';
import { notificationModel } from '../../../database/models/notificationModel';
import { WalletRepository } from '../../../repositories/walletRepository';
import { walletModel } from '../../../database/models/walletModel';
import { GetWalletUseCase } from '../../../../application/implementation/wallet/GetWalletUseCase';

// repository & service
const subscriptionRepository = new SubscriptionRepository(subscriptionModel);
const stripeService = new StripeService();
const userRepository = new UserRepository(userModel);
const membershipRepository = new MembershipRepository(membershipModel);
const notificationRepository = new NotificationRepository(notificationModel);
const createNotification = new CreateNotification(notificationRepository);
const walletRepository = new WalletRepository(walletModel);

// usecase
const getAllSubscriptionUseCase = new GetAllSubscriptionUser(subscriptionRepository);
const createUserCheckoutSessionUseCase = new CreateUserCheckoutSession(subscriptionRepository,userRepository, stripeService, stripeService, membershipRepository,  walletRepository, createNotification);
const webhookHandler = new HandleWebhookUseCase(userRepository, stripeService, membershipRepository, createNotification, walletRepository);
const activeSubscriptionUseCase = new ActiveSubscriptionUseCase(subscriptionRepository, userRepository,membershipRepository);
const nonSubscribedUsersUseCase = new NonSubscribedUsersUseCase(userRepository);

const getWalletUseCase = new GetWalletUseCase(walletRepository);

export const processExpiredSubscriptionsUseCase = new ProcessExpiredSubscriptionsUseCase(membershipRepository, userRepository, createNotification);


// controller
export const userSubscriptionController = new UserSubscriptionController(getAllSubscriptionUseCase, createUserCheckoutSessionUseCase, webhookHandler, activeSubscriptionUseCase, nonSubscribedUsersUseCase, getWalletUseCase);