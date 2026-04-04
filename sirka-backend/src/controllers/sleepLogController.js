import SleepLog from "../models/SleepLog.js";
import User from "../models/User.js";
import { getCache, setCache, clearCachePattern } from "../utils/cache.js";
import { awardPoints } from "../utils/gamificationUtils.js";

export const createSleepLog = async (req, res) => {
  try {
    const { duration, quality, notes, date } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const log = await SleepLog.create({
      user: userId,
      duration,
      quality,
      notes,
      date,
    });

    // Invalidate cache
    clearCachePattern(`sleep:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);

    // Award Gamification Points
    const gamification = await awardPoints(userId, 'LOG_SLEEP');

    res.status(201).json({
      status: "success",
      message: "Data tidur berhasil dicatat",
      data: log,
      gamification
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllSleepLogs = async (req, res) => {
  try {
    const logs = await SleepLog.find().populate("user", "name email");
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getSleepLogsByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const authUserId = req.user.id;

    if (requestedUserId && requestedUserId !== authUserId) {
      return res.status(403).json({ status: "error", message: "Akses ditolak" });
    }

    const userId = requestedUserId || authUserId;
    const cacheKey = `sleep:user:${userId}`;

    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.json({ status: "success", message: "from cache", data: cachedData });
    }

    const logs = await SleepLog.find({ user: userId }).sort({ date: -1 });

    // Set cache
    setCache(cacheKey, logs);

    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateSleepLog = async (req, res) => {
  try {
    const log = await SleepLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Data tidur tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin mengubah log ini" });
    }

    Object.assign(log, req.body);
    await log.save();

    // Invalidate cache
    const userId = req.user.id;
    clearCachePattern(`sleep:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);

    res.json({ status: "success", message: "Data tidur diperbarui", data: log });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteSleepLog = async (req, res) => {
  try {
    const log = await SleepLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Data tidur tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin menghapus log ini" });
    }

    await log.deleteOne();

    // Invalidate cache
    const userId = req.user.id;
    clearCachePattern(`sleep:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);
    clearCachePattern(`history:weekly:${userId}`);

    res.json({ status: "success", message: "Data tidur dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
