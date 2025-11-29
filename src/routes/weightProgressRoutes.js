import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addWeightProgress,
  getAllWeights,
  getWeightsByUser,
  updateWeightProgress,
  deleteWeightProgress,
} from "../controllers/weightProgressController.js";

const router = express.Router();

router.post("/", authMiddleware, addWeightProgress);
router.get("/", authMiddleware, getAllWeights);
router.get("/user/:userId", authMiddleware, getWeightsByUser);
router.put("/:id", authMiddleware, updateWeightProgress);
router.delete("/:id", authMiddleware, deleteWeightProgress);

export default router;