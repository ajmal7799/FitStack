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
}
