
export interface IDeleteMessagesUseCase {
    execute(messageId: string, userId: string): Promise<void>;
}