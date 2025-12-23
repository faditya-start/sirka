import express from "express";
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserProfile,
    updateUserProfile
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

// Profile routes (Auth required)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
