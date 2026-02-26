import { FeedbackController } from "../../../interfaceAdapters/controller/feedback/feedbackController";
import { FeedbackRepository } from "../../repositories/feedbackRepository";
import { TrainerRepository } from "../../repositories/trainerRepository";
import { VideoCallRepository } from "../../repositories/videoCallRepository";
import { feedbackModel } from "../../database/models/feedbackModel";
import { trainerModel } from "../../database/models/trainerModel";
import { videoCallModel } from "../../database/models/videoCallModel";
import { CreateFeedback } from "../../../application/implementation/feedback/CreateFeedback";
import { CreateNotification } from "../../../application/implementation/notification/CreateNotification";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { notificationModel } from "../../database/models/notificationModel";


// repositories & services
const feedbackRepository = new FeedbackRepository(feedbackModel);
const trainerRepository = new TrainerRepository(trainerModel);
const videoCallRepository = new VideoCallRepository(videoCallModel);
const notificationRepository = new NotificationRepository(notificationModel);


// usecase
const createNotification = new CreateNotification( notificationRepository);
const createFeedback = new CreateFeedback(feedbackRepository, videoCallRepository, trainerRepository, createNotification);


// controller
export const feedbackController = new FeedbackController(createFeedback);
