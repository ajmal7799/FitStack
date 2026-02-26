// infrastructure/DI/Admin/adminDashboardContainer.ts
import { AdminDashboardController } from '../../../interfaceAdapters/controller/admin/adminDashboardController';
import { GetDashboardUseCase } from '../../../application/implementation/admin/dashboard/GetDashboardUseCase';
import { DashboardRepository } from '../../repositories/dashboardRepository';
import { userModel } from '../../database/models/userModel';
import { videoCallModel } from '../../database/models/videoCallModel';
import { walletModel } from '../../database/models/walletModel';
import { membershipModel } from '../../database/models/membershipModel';

const dashboardRepository = new DashboardRepository(userModel, videoCallModel, walletModel, membershipModel);
const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);
export const adminDashboardController = new AdminDashboardController(getDashboardUseCase);