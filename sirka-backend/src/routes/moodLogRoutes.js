import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createMoodLog,
    getMoodLogsByUser,
    deleteMoodLog,
} from "../controllers/moodLogController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createMoodLog);
router.get("/my", getMoodLogsByUser);
router.delete("/:id", deleteMoodLog);

export default router;
