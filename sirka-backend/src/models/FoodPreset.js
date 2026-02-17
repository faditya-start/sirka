/**
 * ARCHITECTURE ROLE: FoodPreset Model
 * Skema database untuk menyimpan preset makanan favorit pengguna.
 */
import mongoose from "mongoose";

const foodPresetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
        protein: {
            type: Number,
            default: 0,
        },
        carbs: {
            type: Number,
            default: 0,
        },
        fat: {
            type: Number,
            default: 0,
        },
        portion: {
            type: String,
            default: "1 porsi",
        },
    },
    { timestamps: true }
);

const FoodPreset = mongoose.model("FoodPreset", foodPresetSchema);
export default FoodPreset;
