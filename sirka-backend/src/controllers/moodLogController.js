import MoodLog from "../models/MoodLog.js";
import User from "../models/User.js";
import { getCache, setCache, clearCachePattern } from "../utils/cache.js";

export const createMoodLog = async (req, res) => {
  try {
    const { mood, stressLevel, notes, date } = req.body;
    const userId = req.user.id;

    const log = await MoodLog.create({
      user: userId,
      mood,
      stressLevel,
      notes,
      date,
    });

    // Invalidate cache
    clearCachePattern(`moods:user:${userId}`);
    clearCachePattern(`history:daily:${userId}`);

    res.status(201).json({
      status: "success",
      message: "Suasana hati berhasil dicatat",
      data: log,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllMoodLogs = async (req, res) => {
  try {
    const logs = await MoodLog.find().populate("user", "name email");
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMoodLogsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `moods:user:${userId}`;

    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.json({ status: "success", message: "from cache", data: cachedData });
    }

    const logs = await MoodLog.find({ user: userId }).sort({ date: -1 });

    // Set cache
    setCache(cacheKey, logs);

    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteMoodLog = async (req, res) => {
  try {
    const log = await MoodLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Log tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin" });
    }

    await log.deleteOne();

    // Invalidate cache
    clearCachePattern(`moods:user:${req.user.id}`);

    res.json({ status: "success", message: "Log dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
