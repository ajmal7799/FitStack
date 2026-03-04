"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackController = void 0;
const feedbackController_1 = require("../../../interfaceAdapters/controller/feedback/feedbackController");
const feedbackRepository_1 = require("../../repositories/feedbackRepository");
const trainerRepository_1 = require("../../repositories/trainerRepository");
const videoCallRepository_1 = require("../../repositories/videoCallRepository");
const feedbackModel_1 = require("../../database/models/feedbackModel");
const trainerModel_1 = require("../../database/models/trainerModel");
const videoCallModel_1 = require("../../database/models/videoCallModel");
const CreateFeedback_1 = require("../../../application/implementation/feedback/CreateFeedback");
const CreateNotification_1 = require("../../../application/implementation/notification/CreateNotification");
const notificationRepository_1 = require("../../repositories/notificationRepository");
const notificationModel_1 = require("../../database/models/notificationModel");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
// repositories & services
const feedbackRepository = new feedbackRepository_1.FeedbackRepository(feedbackModel_1.feedbackModel);
const trainerRepository = new trainerRepository_1.TrainerRepository(trainerModel_1.trainerModel);
const videoCallRepository = new videoCallRepository_1.VideoCallRepository(videoCallModel_1.videoCallModel);
const notificationRepository = new notificationRepository_1.NotificationRepository(notificationModel_1.notificationModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
// usecase
const createNotification = new CreateNotification_1.CreateNotification(notificationRepository);
const createFeedback = new CreateFeedback_1.CreateFeedback(feedbackRepository, videoCallRepository, trainerRepository, createNotification, userRepository);
// controller
exports.feedbackController = new feedbackController_1.FeedbackController(createFeedback);
