import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true, trim: true },
        isDeleted: { 
      type: Boolean,
      default: false,
    },
    deletedAt: { 
      type: Date,
    },
    },
    { timestamps: true },
    
)
messageSchema.index({ chatId: 1, createdAt: 1 });
export default messageSchema;