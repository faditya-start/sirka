import mongoose from "mongoose";

const sleepLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number, // dalam jam
      required: true,
    },
    quality: {
      type: String,
      enum: ["Poor", "Fair", "Good", "Excellent"],
      default: "Good",
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

const SleepLog = mongoose.model("SleepLog", sleepLogSchema);
export default SleepLog;
