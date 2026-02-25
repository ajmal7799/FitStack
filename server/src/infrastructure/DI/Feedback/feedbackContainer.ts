import { FeedbackController } from "../../../interfaceAdapters/controller/feedback/feedbackController";
import { FeedbackRepository } from "../../repositories/feedbackRepository";
import { TrainerRepository } from "../../repositories/trainerRepository";
import { VideoCallRepository } from "../../repositories/videoCallRepository";
import { feedbackModel } from "../../database/models/feedbackModel";
import { trainerModel } from "../../database/models/trainerModel";
import { videoCallModel } from "../../database/models/videoCallModel";
import { CreateFeedback } from "../../../application/implementation/feedback/CreateFeedback";

// repositories & services
const feedbackRepository = new FeedbackRepository(feedbackModel);
const trainerRepository = new TrainerRepository(trainerModel);
const videoCallRepository = new VideoCallRepository(videoCallModel);

// usecase
const createFeedback = new CreateFeedback(feedbackRepository, videoCallRepository, trainerRepository);


// controller
export const feedbackController = new FeedbackController(createFeedback);
