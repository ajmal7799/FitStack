"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotification = void 0;
const socketServer_1 = require("../../../infrastructure/socket/socketServer");
class CreateNotification {
    constructor(_notificationRepository) {
        this._notificationRepository = _notificationRepository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield this._notificationRepository.save(data);
            try {
                const io = socketServer_1.SocketService.io;
                const room = saved.recipientId.toString();
                console.log(`🔔 Emitting notification to user room: ${room}`);
                io.to(room).emit('receive_notification', saved);
            }
            catch (error) {
                console.warn('⚠️ Socket not available for notification emit');
            }
            return saved;
        });
    }
}
exports.CreateNotification = CreateNotification;
