import express from "express";
import { getLeaderboard, getMyGamificationStats } from "../controllers/gamificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/me", protect, getMyGamificationStats);

export default router;
