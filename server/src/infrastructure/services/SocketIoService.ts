import { IRealTimeService } from "../../domain/interfaces/services/IRealTimeService";
import { Server } from "socket.io";
import { Notification } from "../../domain/entities/Notification/NotificationEntity";

export class SocketIoService implements IRealTimeService {
  constructor(private _io: Server) {}

 sendNotification(recipientId: string, data: Notification): void {
    this._io.to(recipientId).emit('receive_notification', data);
 }
}
