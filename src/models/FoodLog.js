import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mealTime: {
      type: String,
      enum: ["Pagi", "Siang", "Malam", "Cemilan"],
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    portion: {
      type: String,
      default: "1 porsi",
    },
  },
  { timestamps: true }
);

const FoodLog = mongoose.model("FoodLog", foodLogSchema);
export default FoodLog;
    