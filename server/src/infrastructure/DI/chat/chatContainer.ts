import { ChatController } from "../../../interfaceAdapters/controller/chat/chatController";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { InitiateChatUseCase } from "../../../application/implementation/chat/initiateChatUseCase";
import { ChatRepository } from "../../repositories/chatRepository";
import { TrainerSelectRepository } from "../../repositories/trainerSelectRepository";
import { MessageRepository } from "../../repositories/messageRepository";
import { trainerSelectModel } from "../../database/models/trainerSelectModel";
import { chatModel } from "../../database/models/chatModel";
import { UserRepository } from "../../repositories/userRepository";
import { userModel } from "../../database/models/userModel";
import { StorageService } from "../../services/Storage/storageService";
import { GetMessageUseCase } from "../../../application/implementation/chat/getMessageUseCase";
import { messageModel } from "../../database/models/messageModel";
import { InitiateTrainerChatUseCase } from "../../../application/implementation/chat/initiateTrainerChatUseCase";
import { MarkAsReadUseCase } from "../../../application/implementation/chat/markAsReadUseCase";
import { DeleteMessageUseCase } from "../../../application/implementation/chat/deleteMessageUseCase";
import { GetAttachmentUploadUrlUseCase } from "../../../application/implementation/chat/getAttachmentUploadUrlUseCase";

// Repositories & Services
const trainerSelectRepository = new TrainerSelectRepository(trainerSelectModel);
const chatRepository = new ChatRepository( chatModel);
const userRepository = new UserRepository( userModel); 
const storageService = new StorageService();
const messageRepository = new MessageRepository( messageModel);

// useCases
const initiateChatUseCase = new InitiateChatUseCase( trainerSelectRepository, chatRepository , userRepository, storageService, messageRepository);
const getMessageUseCase = new GetMessageUseCase(messageRepository, chatRepository, storageService);
const initiateTrainerChatUseCase = new InitiateTrainerChatUseCase(trainerSelectRepository, chatRepository, userRepository, storageService);
const markAsRead = new MarkAsReadUseCase(chatRepository);
const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, chatRepository);
const getAttachmentUploadUrlUseCase = new GetAttachmentUploadUrlUseCase(storageService);

// controllers
export const chatController = new ChatController(initiateChatUseCase, getMessageUseCase, initiateTrainerChatUseCase,markAsRead, deleteMessageUseCase, getAttachmentUploadUrlUseCase);