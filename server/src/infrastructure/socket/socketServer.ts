import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuthMiddleware } from '../../interfaceAdapters/middleware/socketAuth';
// import { SocketController } from '../../interfaceAdapters/controllers/socketController';
import { CONFIG } from '../config/config';
import { SocketController } from '../../interfaceAdapters/controller/socket/SocketController';
import { MessageRepository } from '../repositories/messageRepository';
import { SendingMessageUseCase } from '../../application/implementation/chat/sendingMessageUseCase';
import { messageModel } from '../database/models/messageModel';
import { ChatRepository } from '../repositories/chatRepository';
import { chatModel } from '../database/models/chatModel';
import { DeleteMessageUseCase } from '../../application/implementation/chat/deleteMessageUseCase';
import { EndVideoCallSessionUseCase } from '../../application/implementation/Video/EndVideoCallSessionUseCase';
import { VideoCallRepository } from '../repositories/videoCallRepository';
import { videoCallModel } from '../database/models/videoCallModel';
import { SlotRepository } from '../repositories/slotRepository';
import { slotModel } from '../database/models/slotModel';
import { StorageService } from '../services/Storage/storageService';

export class SocketService {
    private static _io: Server;

    public static init(httpServer: HttpServer) {
        this._io = new Server(httpServer, {
            cors: {
                origin: CONFIG.FRONTEND_URL,
                credentials: true,
            },
        });

        
        this._io.use(socketAuthMiddleware);

        const messageRepository = new MessageRepository( messageModel);
        const chatRepository = new ChatRepository( chatModel);
        const videoCallRepository = new VideoCallRepository(videoCallModel);
        const slotRepository = new SlotRepository(slotModel);
        const storageService = new StorageService();

        const sendingMessageUseCase = new SendingMessageUseCase(messageRepository, chatRepository, storageService);
        const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, chatRepository);
        const endVideoCallSessionUseCase = new EndVideoCallSessionUseCase( videoCallRepository, slotRepository);
    
        const socketController = new SocketController(this._io, sendingMessageUseCase, deleteMessageUseCase, endVideoCallSessionUseCase);

        this._io.on('connection', (socket) => {
            socketController.onConnection(socket);
        });

        console.log('📡 Socket.IO initialized in Infrastructure');
        return this._io;
    }


    public static get io() {
        if (!this._io) {
            throw new Error("Socket.IO not initialized!");
        }
        return this._io;
    }
}