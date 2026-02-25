import mongoose from 'mongoose';
import { VideoCallStatus } from '../../../domain/enum/videoCallEnums';
import { UserRole } from '../../../domain/enum/userEnums';

const videoCallSchema = new mongoose.Schema(
    {
        userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    trainerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    slotId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Slot', 
      required: true 
    },
    roomId: { 
      type: String, 
      required: true,
      unique: true // Usually critical for video signaling logic
    },
    trainerJoined: { 
      type: Boolean, 
      default: false 
    },
    userJoined: { 
      type: Boolean, 
      default: false 
    },
    startedAt: { 
      type: Date 
    },
    endedAt: { 
      type: Date 
    },
    startTime: { 
      type: Date, 
      required: true 
    },
    endTime: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(VideoCallStatus), 
      default: VideoCallStatus.WAITING // Adjust default based on your enum
    },
     cancellationReason: { type: String, default: null },
        cancelledAt: { type: Date, default: null },
        cancelledBy: { type: String, enum: Object.values(UserRole), default: null },
    },
    { timestamps: true }

)
videoCallSchema.index({ userId: 1, startedAt: -1 });
videoCallSchema.index({ trainerId: 1, startedAt: -1 });
export default videoCallSchema

