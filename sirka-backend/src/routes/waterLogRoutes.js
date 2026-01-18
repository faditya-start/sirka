/**
 * ARCHITECTURE ROLE: WaterLog Routes
 * Definisi endpoint API untuk manajemen log konsumsi air.
 */
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createWaterLog,
    getAllWaterLogs,
    getWaterLogsByUser,
    updateWaterLog,
    deleteWaterLog,
} from "../controllers/waterLogController.js";

const router = express.Router();

// ==========================================
// WATER LOG ENDPOINTS
// ==========================================

// Semua route memerlukan token auth
router.use(authMiddleware);

router.post("/", createWaterLog);
router.get("/", getAllWaterLogs);
router.get("/user/:userId", getWaterLogsByUser);
router.put("/:id", updateWaterLog);
router.delete("/:id", deleteWaterLog);

export default router;
