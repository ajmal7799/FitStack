"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chatController_1 = require("../../../interfaceAdapters/controller/chat/chatController");
const initiateChatUseCase_1 = require("../../../application/implementation/chat/initiateChatUseCase");
const chatRepository_1 = require("../../repositories/chatRepository");
const trainerSelectRepository_1 = require("../../repositories/trainerSelectRepository");
const messageRepository_1 = require("../../repositories/messageRepository");
const trainerSelectModel_1 = require("../../database/models/trainerSelectModel");
const chatModel_1 = require("../../database/models/chatModel");
const userRepository_1 = require("../../repositories/userRepository");
const userModel_1 = require("../../database/models/userModel");
const storageService_1 = require("../../services/Storage/storageService");
const getMessageUseCase_1 = require("../../../application/implementation/chat/getMessageUseCase");
const messageModel_1 = require("../../database/models/messageModel");
const initiateTrainerChatUseCase_1 = require("../../../application/implementation/chat/initiateTrainerChatUseCase");
const markAsReadUseCase_1 = require("../../../application/implementation/chat/markAsReadUseCase");
const deleteMessageUseCase_1 = require("../../../application/implementation/chat/deleteMessageUseCase");
const getAttachmentUploadUrlUseCase_1 = require("../../../application/implementation/chat/getAttachmentUploadUrlUseCase");
// Repositories & Services
const trainerSelectRepository = new trainerSelectRepository_1.TrainerSelectRepository(trainerSelectModel_1.trainerSelectModel);
const chatRepository = new chatRepository_1.ChatRepository(chatModel_1.chatModel);
const userRepository = new userRepository_1.UserRepository(userModel_1.userModel);
const storageService = new storageService_1.StorageService();
const messageRepository = new messageRepository_1.MessageRepository(messageModel_1.messageModel);
// useCases
const initiateChatUseCase = new initiateChatUseCase_1.InitiateChatUseCase(trainerSelectRepository, chatRepository, userRepository, storageService, messageRepository);
const getMessageUseCase = new getMessageUseCase_1.GetMessageUseCase(messageRepository, chatRepository, storageService);
const initiateTrainerChatUseCase = new initiateTrainerChatUseCase_1.InitiateTrainerChatUseCase(trainerSelectRepository, chatRepository, userRepository, storageService);
const markAsRead = new markAsReadUseCase_1.MarkAsReadUseCase(chatRepository);
const deleteMessageUseCase = new deleteMessageUseCase_1.DeleteMessageUseCase(messageRepository, chatRepository);
const getAttachmentUploadUrlUseCase = new getAttachmentUploadUrlUseCase_1.GetAttachmentUploadUrlUseCase(storageService);
// controllers
exports.chatController = new chatController_1.ChatController(initiateChatUseCase, getMessageUseCase, initiateTrainerChatUseCase, markAsRead, deleteMessageUseCase, getAttachmentUploadUrlUseCase);
