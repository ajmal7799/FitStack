import { Feedback } from "../../../domain/entities/Feedback/feedbackEntity"
import { CreateFeedbackDto } from "../../dto/feedback/createFeedback"
export interface ICreateFeedback {
    createFeedback(userId: string, sessionId : string, rating : number, review : string): Promise< CreateFeedbackDto>
}