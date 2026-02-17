/**
 * ARCHITECTURE ROLE: FoodPreset Controller
 * Mengelola logika bisnis untuk preset/favorit makanan.
 */
import FoodPreset from "../models/FoodPreset.js";

// @desc    Get all food presets for a user
// @route   GET /api/foodpresets
// @access  Private
export const getFoodPresets = async (req, res) => {
    try {
        const presets = await FoodPreset.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: presets.length, data: presets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Create a new food preset
// @route   POST /api/foodpresets
// @access  Private
export const createFoodPreset = async (req, res) => {
    try {
        const { foodName, calories, protein, carbs, fat, portion } = req.body;

        const preset = await FoodPreset.create({
            user: req.user._id,
            foodName,
            calories,
            protein,
            carbs,
            fat,
            portion,
        });

        res.status(201).json({ success: true, data: preset });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid data", error: error.message });
    }
};

// @desc    Delete a food preset
// @route   DELETE /api/foodpresets/:id
// @access  Private
export const deleteFoodPreset = async (req, res) => {
    try {
        const preset = await FoodPreset.findById(req.params.id);

        if (!preset) {
            return res.status(404).json({ success: false, message: "Preset not found" });
        }

        // Ensure user owns the preset
        if (preset.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        await preset.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
