import mongoose from "mongoose";
import { MessageTypeEnums } from "../../../domain/enum/MessageTypeEnums";



const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(MessageTypeEnums),
      required: true,
    },

    text: {
      type: String,
      trim: true,
    },

    attachment: {
      key: { type: String },
      fileName: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export default messageSchema;