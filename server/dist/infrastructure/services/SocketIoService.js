"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoService = void 0;
class SocketIoService {
    constructor(_io) {
        this._io = _io;
    }
    sendNotification(recipientId, data) {
        this._io.to(recipientId).emit('receive_notification', data);
    }
}
exports.SocketIoService = SocketIoService;
