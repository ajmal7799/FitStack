

export interface IJoinSessionUseCase {
    execute(userId: string,slotId: string): Promise<{roomId: string}>;
}