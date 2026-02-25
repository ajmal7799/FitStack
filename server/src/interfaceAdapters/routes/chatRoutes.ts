import express, { Router, type Request, type Response, type NextFunction } from 'express';
import { chatController } from '../../infrastructure/DI/chat/chatContainer';
import { authMiddleware } from '../../infrastructure/DI/Auth/authContainer';
export class Chat_Router {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }
  private _setRoute() {
    this._route.get('/initiate', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.initiateChat(req, res, next);
    });

    this._route.get('/initiatetrainer', authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.initiateChatTrainer(req, res, next);
    });

    this._route.get("/messages/:chatId", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.getMessages(req, res, next);
    });

    this._route.patch("/mark-as-read/:chatId", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.markAsRead(req, res, next);
    });

    this._route.delete("/delete/:messageId", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.deleteMessage(req, res, next);
    });

    this._route.get("/attachment/upload-url", authMiddleware.verify, (req: Request, res: Response, next: NextFunction) => {
        chatController.getAttachment(req, res, next);
      
  });

  }
  public get_router(): Router {
    return this._route;
  }
}
