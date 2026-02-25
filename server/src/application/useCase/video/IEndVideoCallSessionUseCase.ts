

export interface IEndVideoCallSessionUseCase {
    execute(slotId: string): Promise<{sessionId: string}>;
}