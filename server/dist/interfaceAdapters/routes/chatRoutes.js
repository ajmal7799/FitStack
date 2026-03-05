"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat_Router = void 0;
const express_1 = require("express");
const chatContainer_1 = require("../../infrastructure/DI/chat/chatContainer");
const authContainer_1 = require("../../infrastructure/DI/Auth/authContainer");
const userEnums_1 = require("../../domain/enum/userEnums");
class Chat_Router {
    constructor() {
        this._route = (0, express_1.Router)();
        this._setRoute();
    }
    _setRoute() {
        this._route.get('/initiate', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isUser, (req, res, next) => {
            chatContainer_1.chatController.initiateChat(req, res, next);
        });
        this._route.get('/initiatetrainer', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.isTrainer, (req, res, next) => {
            chatContainer_1.chatController.initiateChatTrainer(req, res, next);
        });
        this._route.get('/messages/:chatId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.hasRole(userEnums_1.UserRole.USER, userEnums_1.UserRole.TRAINER), (req, res, next) => {
            chatContainer_1.chatController.getMessages(req, res, next);
        });
        this._route.patch('/mark-as-read/:chatId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.hasRole(userEnums_1.UserRole.USER, userEnums_1.UserRole.TRAINER), (req, res, next) => {
            chatContainer_1.chatController.markAsRead(req, res, next);
        });
        this._route.delete('/delete/:messageId', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.hasRole(userEnums_1.UserRole.USER, userEnums_1.UserRole.TRAINER), (req, res, next) => {
            chatContainer_1.chatController.deleteMessage(req, res, next);
        });
        this._route.get('/attachment/upload-url', authContainer_1.authMiddleware.verify, authContainer_1.authMiddleware.hasRole(userEnums_1.UserRole.USER, userEnums_1.UserRole.TRAINER), (req, res, next) => {
            chatContainer_1.chatController.getAttachment(req, res, next);
        });
    }
    get_router() {
        return this._route;
    }
}
exports.Chat_Router = Chat_Router;
