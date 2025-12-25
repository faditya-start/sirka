import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getDailySummary, getWeeklyTrend, getMonthlyTrend, getYearlyTrend } from "../controllers/historyController.js";

const router = express.Router();

router.get("/daily", authMiddleware, getDailySummary);
router.get("/weekly", authMiddleware, getWeeklyTrend);
router.get("/monthly", authMiddleware, getMonthlyTrend);
router.get("/yearly", authMiddleware, getYearlyTrend);

export default router;