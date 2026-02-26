import { INotificationRepository } from "../../domain/interfaces/repositories/INotificationRepository";
import { BaseRepository } from "./baseRepository";
import { NotficationMapper } from "../../application/mappers/notificationMappers";
import { Notification } from "../../domain/entities/Notification/NotificationEntity";
import { INotificationModel } from "../database/models/notificationModel"; 
import { Model } from "mongoose";



export class NotificationRepository extends BaseRepository<Notification, INotificationModel> implements INotificationRepository {
    constructor(protected _model: Model<INotificationModel>) {
        super(_model, NotficationMapper);
    }

    async findByRecipientId(recipientId: string): Promise<Notification[]> {
        const notifications = await this._model.find({ recipientId: recipientId }).sort({ createdAt: -1 }); 
        return notifications.map((doc) => NotficationMapper.fromMongooseDocument(doc));
    }

   async markAsRead(notificationId: string): Promise<void> {
        await this._model.findByIdAndUpdate(notificationId, { $set: { isRead: true } });
    }


    async markAllAsRead(recipientId: string): Promise<void> {
        await this._model.updateMany({ recipientId: recipientId }, { $set: { isRead: true } });
    }

    async getUnreadCount(recipientId: string): Promise<number> {
        const count = await this._model.countDocuments({ recipientId: recipientId, isRead: false });
        return count;
    }

    async deleteAll(recipientId: string): Promise<void> {
        await this._model.deleteMany({ recipientId: recipientId });
    }

}
