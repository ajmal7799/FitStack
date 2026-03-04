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
exports.SocketController = void 0;
const MessageTypeEnums_1 = require("../../../domain/enum/MessageTypeEnums");
class SocketController {
    constructor(io, sendingMessageUseCase, deleteMessageUseCase, endVideoCallSessionUseCase) {
        this.endingRooms = new Set();
        this.io = io;
        this._sendingMessageUseCase = sendingMessageUseCase;
        this._deleteMessageUseCase = deleteMessageUseCase;
        this._endVideoCallSessionUseCase = endVideoCallSessionUseCase;
    }
    onConnection(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = socket.data.userId;
            console.log(`📡 New connection established. User ID: ${userId}, Socket ID: ${socket.id}`);
            if (userId) {
                yield socket.join(userId.toString());
                console.log(`🏠 User [${userId}] joined personal notification room`);
            }
            else {
                console.warn(`⚠️ Socket [${socket.id}] connected but has no userId in data`);
            }
            socket.on('join_room', (chatId) => {
                if (!chatId) {
                    console.log('⚠️ Join attempt failed: No chatId provided');
                    return;
                }
                socket.join(chatId);
                console.log(`🏠 User [${userId}] joined Chat Room [${chatId}]`);
                socket.to(chatId).emit('user_joined', { userId });
            });
            // --------------------------------------------------
            //              🛠 SEND MESSAGE LOGIC
            // --------------------------------------------------
            socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { chatId, type, text, attachment } = data;
                    if (!chatId || !type) {
                        socket.emit('error', 'Invalid message payload');
                        return;
                    }
                    if (type === MessageTypeEnums_1.MessageTypeEnums.TEXT && (!text || text.trim() === '')) {
                        socket.emit('error', 'Text message cannot be empty');
                        return;
                    }
                    if (type !== MessageTypeEnums_1.MessageTypeEnums.TEXT && !attachment) {
                        socket.emit('error', 'Attachment required');
                        return;
                    }
                    yield socket.join(chatId);
                    const savedMessage = yield this._sendingMessageUseCase.sendMessage({
                        chatId,
                        senderId: userId,
                        type,
                        text,
                        attachment,
                    });
                    this.io.to(chatId).emit('receive_message', savedMessage);
                }
                catch (error) {
                    console.error('❌ Error handling send_message:', error);
                    socket.emit('error', 'Message could not be sent');
                }
            }));
            socket.on('delete_message', (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { messageId, chatId } = data;
                    console.log(`🗑️ Received delete request for message ${messageId} from user ${userId}`);
                    yield this._deleteMessageUseCase.execute(messageId, userId);
                    yield socket.join(chatId);
                    this.io.to(chatId).emit('message_deleted', { messageId });
                }
                catch (error) {
                    console.error('❌ Error handling delete_message:', error);
                    socket.emit('error', 'Message could not be deleted');
                }
            }));
            socket.on('disconnect', () => {
                console.log(`🔌 User ${userId} disconnected`);
            });
            // --------------------------------------------------
            //              🛠 VIDEO CALL
            // --------------------------------------------------
            socket.on('video_call:join', ({ roomId, userId, slotId }) => {
                console.log(`🎥 User [${userId}] joined Video Room [${roomId}]`);
                if (!roomId)
                    return;
                const vUserId = userId;
                socket.data.roomId = roomId;
                socket.data.slotId = slotId;
                socket.join(roomId);
                console.log(`🎥 User [${vUserId}] joined Video Room [${roomId}]`);
                // Notify the other user in the room that a peer has arrived.
                // This is the "trigger" for Peer A to start the WebRTC handshake.
                socket.to(roomId).emit('video_call:peer_joined', { userId });
            });
            // 2. SIGNAL RELAY (The "Mailman")
            socket.on('video_call:signal', (data) => {
                const { roomId, signalData } = data;
                // Take the WebRTC data from Peer A and send it directly to Peer B.
                // We use socket.to(roomId) to ensure the sender doesn't receive their own signal.
                socket.to(roomId).emit('video_call:signal', signalData);
            });
            // 3. LEAVE VIDEO ROOM
            socket.on('video_call:leave', (_a) => __awaiter(this, [_a], void 0, function* ({ roomId }) {
                const userId = socket.data.userId;
                const slotId = socket.data.slotId;
                socket.leave(roomId);
                socket.to(roomId).emit('video_call:peer_left');
                yield new Promise(resolve => setTimeout(resolve, 300));
                const remaining = (yield this.io.in(roomId).allSockets()).size;
                if (remaining === 0 && slotId && !this.endingRooms.has(roomId)) {
                    this.endingRooms.add(roomId);
                    try {
                        yield this._endVideoCallSessionUseCase.execute(slotId);
                        // ✅ Notify both users that session is officially completed
                        this.io.to(roomId).emit('video_call:session_completed', { slotId });
                    }
                    catch (err) {
                    }
                    finally {
                        setTimeout(() => this.endingRooms.delete(roomId), 5000);
                    }
                }
            }));
            // --------------------------------------------------
            //              🛠 NOTIFICATION
            // --------------------------------------------------
        });
    }
}
exports.SocketController = SocketController;
