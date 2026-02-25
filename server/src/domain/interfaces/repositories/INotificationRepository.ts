import { Notification } from "../../entities/Notification/NotificationEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserRole } from "../../enum/userEnums";
import { NotificationType } from "../../enum/NotificationEnums";


export interface INotificationRepository extends IBaseRepository<Notification> {
    
}