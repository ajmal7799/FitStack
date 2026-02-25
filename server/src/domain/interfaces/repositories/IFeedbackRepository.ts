import { IBaseRepository } from "./IBaseRepository";
import { Feedback } from "../../entities/Feedback/feedbackEntity";


export interface IFeedbackRepository extends IBaseRepository<Feedback> {
    findBySessionId(sessionId: string): Promise<Feedback | null>
}