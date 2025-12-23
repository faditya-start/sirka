import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createActivityLog,
  getAllActivities,
  getActivitiesByUser,
  updateActivityLog,
  deleteActivityLog,
} from "../controllers/activityLogController.js";

const router = express.Router();

router.post("/", authMiddleware, createActivityLog);
router.get("/", authMiddleware, getAllActivities);
router.get("/user/:userId", authMiddleware, getActivitiesByUser);
router.put("/:id", authMiddleware, updateActivityLog);
router.delete("/:id", authMiddleware, deleteActivityLog);

export default router;