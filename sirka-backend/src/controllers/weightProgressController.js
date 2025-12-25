import WeightProgress from "../models/WeightProgress.js";
import User from "../models/User.js";

export const addWeightProgress = async (req, res) => {
  try {
    const { weight, date, note } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const log = await WeightProgress.create({
      user: userId,
      weight,
      date,
      note,
    });

    // Update current weight in User profile
    user.weight = weight;
    await user.save();

    // Calculate current BMI
    const heightInMeters = user.height / 100;
    const bmi = user.height ? (weight / (heightInMeters * heightInMeters)).toFixed(1) : null;

    res.status(201).json({
      status: "success",
      message: "Berat badan berhasil dicatat dan profil diperbarui",
      data: {
        ...log._doc,
        currentBMI: bmi
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllWeights = async (req, res) => {
  try {
    const logs = await WeightProgress.find({ user: req.user.id }).sort({ date: 1 });
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getWeightsByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const authUserId = req.user.id;

    if (requestedUserId && requestedUserId !== authUserId) {
      return res.status(403).json({ status: "error", message: "Akses ditolak" });
    }

    const userId = requestedUserId || authUserId;

    const logs = await WeightProgress.find({ user: userId }).sort({ date: -1 });
    res.json({ status: "success", data: logs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateWeightProgress = async (req, res) => {
  try {
    const log = await WeightProgress.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin mengubah data ini" });
    }

    Object.assign(log, req.body);
    await log.save();

    res.json({ status: "success", message: "Data berat badan diperbarui", data: log });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteWeightProgress = async (req, res) => {
  try {
    const log = await WeightProgress.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ status: "error", message: "Tidak punya izin menghapus data ini" });
    }

    await log.deleteOne();
    res.json({ status: "success", message: "Data berat badan dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
