/**
 * ARCHITECTURE ROLE: FoodPreset Routes
 * Mendefinisikan endpoint API untuk preset makanan.
 */
import express from "express";
import {
    getFoodPresets,
    createFoodPreset,
    deleteFoodPreset,
} from "../controllers/foodPresetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(protect, getFoodPresets)
    .post(protect, createFoodPreset);

router.route("/:id")
    .delete(protect, deleteFoodPreset);

export default router;
