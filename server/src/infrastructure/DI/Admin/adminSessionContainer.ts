import { AdminSessionController } from "../../../interfaceAdapters/controller/admin/adminSessionController";
import { SessionHistoryUseCase } from "../../../application/implementation/admin/session/SessionHistoryUseCase";
import { VideoCallRepository } from "../../repositories/videoCallRepository";
import { videoCallModel } from "../../database/models/videoCallModel";
import { SessionAdminHistoryUseCase } from "../../../application/implementation/admin/session/SessionAdminHistoryUseCase";
import { UserRepository } from "../../repositories/userRepository";
import { userModel } from "../../database/models/userModel";
import { StorageService } from "../../services/Storage/storageService";
import { FeedbackRepository } from "../../repositories/feedbackRepository";
import { feedbackModel } from "../../database/models/feedbackModel";


// repositories & services
const videoCallRepository = new VideoCallRepository(videoCallModel);
const userRepository = new UserRepository(userModel);
const storageService = new StorageService();
const feedbackRepository = new FeedbackRepository(feedbackModel);

// use cases
const sessionHistoryUseCase = new SessionHistoryUseCase(
    videoCallRepository,
    feedbackRepository

);

const sessionAdminHistoryUseCase = new SessionAdminHistoryUseCase(
    videoCallRepository,
    userRepository,
    storageService,
    feedbackRepository
);

// controllers
export const adminSessionController = new AdminSessionController(
    sessionHistoryUseCase,
    sessionAdminHistoryUseCase
);