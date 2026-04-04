/**
 * ARCHITECTURE ROLE: FoodLog Controller
 * Menangani logika CRUD untuk pencatatan makanan pengguna.
 */
import FoodLog from "../models/FoodLog.js";
import User from "../models/User.js";
import { getCache, setCache, clearCachePattern } from "../utils/cache.js";
import { awardPoints } from "../utils/gamificationUtils.js";

/**
 * Membuat catatan makanan baru
 */
export const createFoodLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodName, calories, protein, carbs, fat, mealTime, portion, date } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const log = await FoodLog.create({
      user: userId,
      foodName,
      calories,
      protein,
      carbs,
      fat,
      mealTime,
      portion,
      date,
    });

    // Invalidate cache
    clearCachePattern(`foodlogs:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);
    clearCachePattern(`history:monthly:${userId}`);
    clearCachePattern(`history:yearly:${userId}`);

    // Award Gamification Points
    const gamification = await awardPoints(userId, 'LOG_FOOD');

    res.status(201).json({
      status: "success",
      message: "Log makanan berhasil dibuat",
      data: log,
      gamification // Sertakan info gamifikasi untuk pop-up/notifikasi
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Mengambil semua catatan makanan milik user yang sedang login
 */
export const getFoodLogsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `foodlogs:user:${userId}`;

    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.json({
        status: "success",
        message: "Daftar log makanan user (from cache)",
        count: cachedData.length,
        data: cachedData,
      });
    }

    const logs = await FoodLog.find({ user: userId }).sort({ date: -1 });

    // Set cache
    setCache(cacheKey, logs);

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

    // Invalidate cache
    const userId = req.user.id;
    clearCachePattern(`foodlogs:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);
    clearCachePattern(`history:monthly:${userId}`);
    clearCachePattern(`history:yearly:${userId}`);

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

    // Invalidate cache
    const userId = req.user.id;
    clearCachePattern(`foodlogs:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);
    clearCachePattern(`history:monthly:${userId}`);
    clearCachePattern(`history:yearly:${userId}`);

    res.json({
      status: "success",
      message: "Log berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
