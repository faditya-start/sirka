import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // dalam menit
      required: true,
    },
    intensity: {
      type: String,
      enum: ["Rendah", "Sedang", "Tinggi"],
      default: "Sedang",
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
