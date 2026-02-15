import { IMarkAsReadUseCase } from "../../useCase/chat/IMarkAsReadUseCase";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";
import { NotFoundException } from "../../constants/exceptions";
import { CHAT_ERRORS } from "../../../shared/constants/error";


export class MarkAsReadUseCase implements IMarkAsReadUseCase {
    constructor(private _chatRepository: IChatRepository) { }
    async execute(chatId: string, userId: string): Promise<void> {
        const chat = await this._chatRepository.findById(chatId);
        if (!chat) {
            throw new NotFoundException(CHAT_ERRORS.CHAT_NOT_FOUND);
        }
           const userType = userId === chat.userId ? 'user' : 'trainer';
        await this._chatRepository.resetUnreadCount(chatId, userType);
    }
}