import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.post("/", authMiddleware, createProgram);
router.get("/", authMiddleware, getPrograms);
router.get("/:id", authMiddleware, getProgramById);
router.put("/:id", authMiddleware, updateProgram);
router.delete("/:id", authMiddleware, deleteProgram);

export default router;