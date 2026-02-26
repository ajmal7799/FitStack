import { INotificationModel } from "../../infrastructure/database/models/notificationModel";
import { Notification} from "../../domain/entities/Notification/NotificationEntity";
import mongoose, { Mongoose } from 'mongoose';


export class NotficationMapper {
    static toMongooseDocument(notification: Notification) {
        return {
            _id: new mongoose.Types.ObjectId(notification._id),
            recipientId: new mongoose.Types.ObjectId(notification.recipientId),
            recipientRole: notification.recipientRole,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            relatedId: notification.relatedId,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        }
    }

    static fromMongooseDocument(notification: INotificationModel) : Notification {
        return {
            _id: notification._id.toString(),
            recipientId: notification.recipientId.toString(),
            recipientRole: notification.recipientRole,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            relatedId: notification.relatedId?.toString() ,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        }
    }
}

