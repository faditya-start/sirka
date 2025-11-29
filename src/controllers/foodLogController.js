import FoodLog from "../models/FoodLog.js";
import User from "../models/User.js";

export const createFoodLog = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { foodName, calories, mealTime, portion, date } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const log = await FoodLog.create({
      user: userId,
      foodName,
      calories,
      mealTime,
      portion,
      date,
    });

    res.status(201).json({
      status: "success",
      message: "Log makanan berhasil dibuat",
      data: log,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getFoodLogsByUser = async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user.id }).sort({ date: -1 });

    res.json({
      status: "success",
      message: "Daftar log makanan user",
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllFoodLogs = async (req, res) => {
  try {
    const logs = await FoodLog.find().populate("user", "name email");

    res.json({
      status: "success",
      message: "Daftar semua log makanan (Admin)",
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ status: "error", message: "Log tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Tidak punya izin mengubah log ini",
      });
    }

    Object.assign(log, req.body);
    await log.save();

    res.json({
      status: "success",
      message: "Log berhasil diperbarui",
      data: log,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ status: "error", message: "Log tidak ditemukan" });
    }
    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Tidak punya izin menghapus log ini",
      });
    }

    await log.deleteOne();

    res.json({
      status: "success",
      message: "Log berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
