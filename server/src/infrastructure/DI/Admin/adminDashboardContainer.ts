// infrastructure/DI/Admin/adminDashboardContainer.ts
import { AdminDashboardController } from '../../../interfaceAdapters/controller/admin/adminDashboardController';
import { GetDashboardUseCase } from '../../../application/implementation/admin/dashboard/GetDashboardUseCase';
import { DashboardRepository } from '../../repositories/dashboardRepository';
import { userModel } from '../../database/models/userModel';
import { videoCallModel } from '../../database/models/videoCallModel';
import { walletModel } from '../../database/models/walletModel';
import { membershipModel } from '../../database/models/membershipModel';
import { GetRevenueListingUseCase } from '../../../application/implementation/admin/revenue/GetRevenueListingUseCase';
import { WalletRepository } from '../../repositories/walletRepository';
import { VideoCallRepository } from '../../repositories/videoCallRepository';
import { UserRepository } from '../../repositories/userRepository';

const walletRepository = new WalletRepository(walletModel);
const videoCallRepository = new VideoCallRepository(videoCallModel);
const userRepository = new UserRepository(userModel);

const dashboardRepository = new DashboardRepository(userModel, videoCallModel, walletModel, membershipModel);

const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);
const getRevenueListingUseCase = new GetRevenueListingUseCase( walletRepository, videoCallRepository, userRepository);

export const adminDashboardController = new AdminDashboardController(getDashboardUseCase, getRevenueListingUseCase);