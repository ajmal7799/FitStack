export interface ICreateTrainerUseCase {
    createTrainer(email: string) : Promise<void>
}