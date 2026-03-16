import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createSleepLog,
    getAllSleepLogs,
    getSleepLogsByUser,
    updateSleepLog,
    deleteSleepLog,
} from "../controllers/sleepLogController.js";

const router = express.Router();

// Semua route memerlukan token auth
router.use(authMiddleware);

router.post("/", createSleepLog);
router.get("/", getAllSleepLogs);
router.get("/user/:userId", getSleepLogsByUser);
router.put("/:id", updateSleepLog);
router.delete("/:id", deleteSleepLog);

export default router;
