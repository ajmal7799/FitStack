

export interface IEndVideoCallSessionUseCase {
    execute(slotId: string): Promise<void>;
}