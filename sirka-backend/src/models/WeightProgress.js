import mongoose from "mongoose";

const weightProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const WeightProgress = mongoose.model("WeightProgress", weightProgressSchema);
export default WeightProgress;
