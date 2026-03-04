"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notificationController_1 = require("../../../interfaceAdapters/controller/notification/notificationController");
const notificationRepository_1 = require("../../repositories/notificationRepository");
const notificationModel_1 = require("../../database/models/notificationModel");
const GetNotification_1 = require("../../../application/implementation/notification/GetNotification");
const MarkAsRead_1 = require("../../../application/implementation/notification/MarkAsRead");
// Repository & Service
const notificationRepository = new notificationRepository_1.NotificationRepository(notificationModel_1.notificationModel);
// useCases
const getNotificationUseCase = new GetNotification_1.GetNotificationsUseCase(notificationRepository);
const markAsReadUseCase = new MarkAsRead_1.MarkAsReadUseCase(notificationRepository);
// controllers
exports.notificationController = new notificationController_1.NotificationController(getNotificationUseCase, markAsReadUseCase);
