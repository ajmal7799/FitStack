import { NextFunction, Request, Response } from 'express';
import { MulterFiles } from '../../../domain/types/multerFilesType';
import { multerFileToFileConverter } from '../../../shared/utils/fileConverter';
import { Errors, TRAINER_ERRORS } from '../../../shared/constants/error';
import { ResponseHelper } from '../../../shared/utils/responseHelper';
import { MESSAGES } from '../../../shared/constants/messages';
import { DataMissingExecption, InvalidDataException } from '../../../application/constants/exceptions';
import { HTTPStatus } from '../../../shared/constants/httpStatus';
import { IInitiateChatUseCase } from '../../../application/useCase/chat/IInitiateChatUseCase';
import { IGetMessageUseCase } from '../../../application/useCase/chat/IGetMessageUseCase';
import { IInitiateTrainerChatUseCase } from '../../../application/useCase/chat/IInitiateTrainerChatUseCase';
import { IMarkAsReadUseCase } from '../../../application/useCase/chat/IMarkAsReadUseCase';
import { IDeleteMessagesUseCase } from '../../../application/useCase/chat/IDeleteMessagesUseCase';
import { IGetAttachmentUploadUrlUseCase } from '../../../application/useCase/chat/IGetAttachmentUploadUrlUseCase';


export class ChatController {
  constructor(
    private _initiateChatUseCase: IInitiateChatUseCase,
    private _getMessageUseCase: IGetMessageUseCase,
    private _initiateTrainerChatUseCase: IInitiateTrainerChatUseCase,
    private _markAsReadUseCase: IMarkAsReadUseCase,
    private _deleteMessageUseCase: IDeleteMessagesUseCase,
    private _getAttachmentUploadUrlUseCase: IGetAttachmentUploadUrlUseCase
  ) {}

  async initiateChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const result = await this._initiateChatUseCase.initiateChat(userId);

      ResponseHelper.success(res, MESSAGES.CHAT.INITIATE_CHAT_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async initiateChatTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.userId;

      if (!trainerId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const result = await this._initiateTrainerChatUseCase.initiateChatTrainer(trainerId);

      ResponseHelper.success(res, MESSAGES.CHAT.INITIATE_CHAT_SUCCESS, { result }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { chatId } = req.params;

      if (!userId && !chatId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }
      const messages = await this._getMessageUseCase.getMessages(userId!, chatId);

      ResponseHelper.success(res, MESSAGES.CHAT.MESSAGES_FETCHED_SUCCESS, { messages }, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId } = req.params;
      const userId = req.user?.userId;

      if (!chatId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      await this._markAsReadUseCase.execute(chatId, userId!);

      ResponseHelper.success(res, MESSAGES.CHAT.MARK_AS_READ_SUCCESS, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user?.userId;
      if (!messageId) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      await this._deleteMessageUseCase.execute(messageId, userId!);

      ResponseHelper.success(res, MESSAGES.CHAT.DELETE_MESSAGE_SUCCESS, HTTPStatus.OK);
    } catch (error) {
      next(error);
    }
  }

  async getAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { chatId, fileName, fileType } = req.query as {
        chatId: string;
        fileName: string;
        fileType: string;
    };

    if (!chatId || !fileName || !fileType) {
      throw new InvalidDataException(Errors.INVALID_DATA);
    }

    const result = await this._getAttachmentUploadUrlUseCase.execute(chatId, fileName, fileType);
ResponseHelper.success(res, MESSAGES.CHAT.GET_ATTACHMENT_SUCCESS, result, HTTPStatus.OK);


  }

}
