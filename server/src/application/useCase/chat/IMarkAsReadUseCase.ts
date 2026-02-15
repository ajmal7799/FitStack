
export interface IMarkAsReadUseCase {
    execute(chatId: string, userId: string): Promise<void>;
}