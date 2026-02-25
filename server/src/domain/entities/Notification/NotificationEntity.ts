import { UserRole } from '../../enum/userEnums';
import { NotificationType } from '../../enum/NotificationEnums';

export interface Notification {
  _id?: string;
  recipientId: string;
  recipientRole: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead?: boolean;
  createdAt?: Date;
}
