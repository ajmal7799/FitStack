import mongoose, { Schema, Document } from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  exerciseName: String,
  sets: Number,
  reps: String,
  rest: String,
  notes: String
}, { _id: false });

const DayPlanSchema = new mongoose.Schema({
  day: String,
  focus: String,
  isRestDay: { type: Boolean, default: false },
  warmup: {
    duration: String,
    exercises: [String]
  },
  mainWorkout: [ExerciseSchema],
  cooldown: {
    duration: String,
    exercises: [String]
  }
}, { _id: false });

const WorkoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weeklyPlan: [DayPlanSchema],
  progressionGuidelines: Schema.Types.Mixed, 
  importantNotes: {
    safetyTips: [String],
    restAndRecovery: String,
    nutrition: String,
    hydration: String,
    whenToStopExercising: [String]
  },
  equipmentNeeded: [String],
  expectedResults: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});


WorkoutPlanSchema.index({ userId: 1, isActive: 1 });

export default WorkoutPlanSchema;