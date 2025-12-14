
export interface IHandleWebhookUseCase {
    excute(event: Buffer, signature: string): Promise<void>;
}
