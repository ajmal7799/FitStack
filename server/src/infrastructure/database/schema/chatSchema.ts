import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
    lastSenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    unreadCount: {
      user: { type: Number, default: 0 },
      trainer: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
chatSchema.index({ userId: 1, trainerId: 1 }, { unique: true });

export default chatSchema;
