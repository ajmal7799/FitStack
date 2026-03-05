"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const socketAuth_1 = require("../../interfaceAdapters/middleware/socketAuth");
// import { SocketController } from '../../interfaceAdapters/controllers/socketController';
const config_1 = require("../config/config");
const SocketController_1 = require("../../interfaceAdapters/controller/socket/SocketController");
const messageRepository_1 = require("../repositories/messageRepository");
const sendingMessageUseCase_1 = require("../../application/implementation/chat/sendingMessageUseCase");
const messageModel_1 = require("../database/models/messageModel");
const chatRepository_1 = require("../repositories/chatRepository");
const chatModel_1 = require("../database/models/chatModel");
const deleteMessageUseCase_1 = require("../../application/implementation/chat/deleteMessageUseCase");
const EndVideoCallSessionUseCase_1 = require("../../application/implementation/Video/EndVideoCallSessionUseCase");
const videoCallRepository_1 = require("../repositories/videoCallRepository");
const videoCallModel_1 = require("../database/models/videoCallModel");
const slotRepository_1 = require("../repositories/slotRepository");
const slotModel_1 = require("../database/models/slotModel");
const storageService_1 = require("../services/Storage/storageService");
const walletRepository_1 = require("../repositories/walletRepository");
const walletModel_1 = require("../database/models/walletModel");
const membershipRepository_1 = require("../repositories/membershipRepository");
const membershipModel_1 = require("../database/models/membershipModel");
const subscriptionRepository_1 = require("../repositories/subscriptionRepository");
const subscriptionModel_1 = require("../database/models/subscriptionModel");
const notificationRepository_1 = require("../repositories/notificationRepository");
const notificationModel_1 = require("../database/models/notificationModel");
const CreateNotification_1 = require("../../application/implementation/notification/CreateNotification");
class SocketService {
    static init(httpServer) {
        this._io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: config_1.CONFIG.FRONTEND_URL,
                credentials: true,
            },
        });
        this._io.use(socketAuth_1.socketAuthMiddleware);
        const messageRepository = new messageRepository_1.MessageRepository(messageModel_1.messageModel);
        const chatRepository = new chatRepository_1.ChatRepository(chatModel_1.chatModel);
        const videoCallRepository = new videoCallRepository_1.VideoCallRepository(videoCallModel_1.videoCallModel);
        const slotRepository = new slotRepository_1.SlotRepository(slotModel_1.slotModel);
        const storageService = new storageService_1.StorageService();
        const walletRepository = new walletRepository_1.WalletRepository(walletModel_1.walletModel);
        const membershipRepository = new membershipRepository_1.MembershipRepository(membershipModel_1.membershipModel);
        const subscriptionRepository = new subscriptionRepository_1.SubscriptionRepository(subscriptionModel_1.subscriptionModel);
        const notificationRepository = new notificationRepository_1.NotificationRepository(notificationModel_1.notificationModel);
        const createNotification = new CreateNotification_1.CreateNotification(notificationRepository);
        const sendingMessageUseCase = new sendingMessageUseCase_1.SendingMessageUseCase(messageRepository, chatRepository, storageService);
        const deleteMessageUseCase = new deleteMessageUseCase_1.DeleteMessageUseCase(messageRepository, chatRepository);
        const endVideoCallSessionUseCase = new EndVideoCallSessionUseCase_1.EndVideoCallSessionUseCase(videoCallRepository, slotRepository, walletRepository, membershipRepository, subscriptionRepository, createNotification);
        const socketController = new SocketController_1.SocketController(this._io, sendingMessageUseCase, deleteMessageUseCase, endVideoCallSessionUseCase);
        this._io.on('connection', (socket) => {
            socketController.onConnection(socket);
        });
        console.log('📡 Socket.IO initialized in Infrastructure');
        return this._io;
    }
    static get io() {
        if (!this._io) {
            throw new Error('Socket.IO not initialized!');
        }
        return this._io;
    }
}
exports.SocketService = SocketService;
