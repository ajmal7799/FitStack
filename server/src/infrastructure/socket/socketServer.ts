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
        const sendingMessageUseCase = new SendingMessageUseCase(messageRepository, chatRepository);
        const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, chatRepository);
    
        const socketController = new SocketController(this._io, sendingMessageUseCase, deleteMessageUseCase);

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