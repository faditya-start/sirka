import WaterLog from "../models/WaterLog.js";
import User from "../models/User.js";

export const createWaterLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, date } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
        }

        const log = await WaterLog.create({
            user: userId,
            amount,
            date,
        });

        res.status(201).json({
            status: "success",
            message: "Log air berhasil dibuat",
            data: log,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getWaterLogsByUser = async (req, res) => {
    try {
        const logs = await WaterLog.find({ user: req.user.id }).sort({ date: -1 });

        res.json({
            status: "success",
            message: "Daftar log air user",
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getAllWaterLogs = async (req, res) => {
    try {
        const logs = await WaterLog.find().populate("user", "name email");

        res.json({
            status: "success",
            message: "Daftar semua log air (Admin)",
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateWaterLog = async (req, res) => {
    try {
        const log = await WaterLog.findById(req.params.id);

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
            message: "Log air berhasil diperbarui",
            data: log,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteWaterLog = async (req, res) => {
    try {
        const log = await WaterLog.findById(req.params.id);

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
            message: "Log air berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
