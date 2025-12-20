import mongoose from "mongoose";

const waterLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number, // dalam ml
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const WaterLog = mongoose.model("WaterLog", waterLogSchema);
export default WaterLog;
