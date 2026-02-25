import mongoose from 'mongoose';


const feedbackSchema = new mongoose.Schema({
    sessionId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'VideoCall',
        required: true,
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Alternative way to define the index explicitly
// feedbackSchema.index({ sessionId: 1 }, { unique: true });

export default feedbackSchema;