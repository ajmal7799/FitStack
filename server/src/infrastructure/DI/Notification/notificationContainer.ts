import { NotificationController } from "../../../interfaceAdapters/controller/notification/notificationController";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { notificationModel } from "../../database/models/notificationModel";
import { CreateNotification } from "../../../application/implementation/notification/CreateNotification";
import { GetNotificationsUseCase } from "../../../application/implementation/notification/GetNotification";
import { MarkAsReadUseCase } from "../../../application/implementation/notification/MarkAsRead";


// Repository & Service
const notificationRepository = new NotificationRepository(notificationModel);



// useCases
const getNotificationUseCase = new GetNotificationsUseCase(notificationRepository);
const markAsReadUseCase = new MarkAsReadUseCase(notificationRepository);



// controllers
export const notificationController = new NotificationController(
    getNotificationUseCase,
    markAsReadUseCase,
);
