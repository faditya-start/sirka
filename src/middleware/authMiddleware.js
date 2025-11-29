import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Token tidak diberikan",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan"
      });
    }

    // set id dan role untuk digunakan di controller
    req.user = { id: user._id.toString(), role: user.role || "user" };
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token tidak valid",
    });
  }
};
