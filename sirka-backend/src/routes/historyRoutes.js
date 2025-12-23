import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getDailySummary, getWeeklyTrend } from "../controllers/historyController.js";

const router = express.Router();

router.get("/daily", authMiddleware, getDailySummary);
router.get("/weekly", authMiddleware, getWeeklyTrend);

export default router;