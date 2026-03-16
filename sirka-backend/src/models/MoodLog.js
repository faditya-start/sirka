import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      enum: ["Happy", "Calm", "Neutral", "Sad", "Stressed", "Energetic"],
      required: true,
    },
    stressLevel: {
      type: Number, // 1 to 5
      min: 1,
      max: 5,
      default: 3,
    },
    notes: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MoodLog = mongoose.model("MoodLog", moodLogSchema);
export default MoodLog;
