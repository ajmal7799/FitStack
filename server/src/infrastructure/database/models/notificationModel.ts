import { Document, model, Types } from "mongoose";
import notificationSchema from "../schema/NotificationSchema";
import { UserRole } from "../../../domain/enum/userEnums";
import { NotificationType } from "../../../domain/enum/NotificationEnums";


export interface INotificationModel extends Document {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId;
    recipientRole: UserRole;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
    isRead?: boolean;
    createdAt?: Date;
}

export const notificationModel = model<INotificationModel>('Notification', notificationSchema);