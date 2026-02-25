import mongoose from "mongoose";
import { UserRole } from "../../../domain/enum/userEnums";
import { NotificationType } from "../../../domain/enum/NotificationEnums";


const notificationSchema = new mongoose.Schema(
    {
        recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        recipientRole: { type: String, enum: Object.values(UserRole), required: true },
        type: { type: String, enum: Object.values(NotificationType), required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        relatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);
export default notificationSchema;

