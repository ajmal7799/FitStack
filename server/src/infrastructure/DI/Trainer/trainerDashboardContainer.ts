// infrastructure/DI/trainer/trainerDashboardContainer.ts
import { TrainerDashboardController } from '../../../interfaceAdapters/controller/trainer/trainerDashboardController';
import { GetTrainerDashboardUseCase } from '../../../application/implementation/trainer/dashboard/GetTrainerDashboardUseCase';
import { TrainerDashboardRepository } from '../../repositories/trainerDashboardRepository';
import { videoCallModel } from '../../database/models/videoCallModel';
import { walletModel } from '../../database/models/walletModel';
import { feedbackModel } from '../../database/models/feedbackModel';
import { trainerSelectModel } from '../../database/models/trainerSelectModel';
import { userModel } from '../../database/models/userModel';

const trainerDashboardRepository = new TrainerDashboardRepository(
    videoCallModel,
    walletModel,
    feedbackModel,
    trainerSelectModel,
    userModel,
);

const getTrainerDashboardUseCase = new GetTrainerDashboardUseCase(trainerDashboardRepository);
export const trainerDashboardController = new TrainerDashboardController(getTrainerDashboardUseCase);