

export interface ITrainerSelectUseCase {
    selectTrainer(userId: string, trainerId: string): Promise<void>;
}