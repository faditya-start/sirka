import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

export const createActivityLog = async (req, res) => {
  try {
    const { activityName, duration, intensity, caloriesBurned, date } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const log = await ActivityLog.create({
      user: userId,
      activityName,
      duration,
      intensity,
      caloriesBurned,
      date,
    });

    res.status(201).json({
      status: "success",
      message: "Aktivitas berhasil dicatat",
      data: log,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate("user", "name email");
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getActivitiesByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const authUserId = req.user.id;

    if (requestedUserId && requestedUserId !== authUserId) {
      return res.status(403).json({ status: "error", message: "Akses ditolak" });
    }

    const userId = requestedUserId || authUserId;

    const logs = await ActivityLog.find({ user: userId }).sort({ date: -1 });
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Aktivitas tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin mengubah log ini" });
    }

    Object.assign(log, req.body);
    await log.save();

    res.json({ status: "success", message: "Aktivitas diperbarui", data: log });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Aktivitas tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin menghapus log ini" });
    }

    await log.deleteOne();
    res.json({ status: "success", message: "Aktivitas dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
