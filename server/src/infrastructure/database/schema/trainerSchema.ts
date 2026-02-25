import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    trainerId: { type: String, required: true, unique: true },
    qualification: { type: String, required: true },
    specialisation: { type: String, required: true },
    experience: { type: Number, required: true },
    about: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    ratingCount: {
      type: Number,
      default: 0,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export default trainerSchema;
