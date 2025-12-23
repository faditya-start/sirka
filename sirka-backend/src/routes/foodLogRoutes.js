import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createFoodLog,
  getAllFoodLogs,
  getFoodLogsByUser,
  updateFoodLog,
  deleteFoodLog,
} from "../controllers/foodLogController.js";

const router = express.Router();

router.post("/", authMiddleware, createFoodLog);
router.get("/", authMiddleware, getAllFoodLogs);
router.get("/user/:userId", authMiddleware, getFoodLogsByUser);
router.put("/:id", authMiddleware, updateFoodLog);
router.delete("/:id", authMiddleware, deleteFoodLog);

export default router;
