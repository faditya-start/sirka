import WaterLog from "../models/WaterLog.js";
import User from "../models/User.js";
import { getCache, setCache, clearCachePattern } from "../utils/cache.js";

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

        // Invalidate cache
        clearCachePattern(`waterlogs:user:${userId}`);
        clearCachePattern(`history:daily:${userId}`);
        clearCachePattern(`history:weekly:${userId}`);
        clearCachePattern(`history:monthly:${userId}`);
        clearCachePattern(`history:yearly:${userId}`);

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
        const userId = req.user.id;
        const cacheKey = `waterlogs:user:${userId}`;

        const cachedData = getCache(cacheKey);
        if (cachedData) {
            return res.json({
                status: "success",
                message: "Daftar log air user (from cache)",
                count: cachedData.length,
                data: cachedData,
            });
        }

        const logs = await WaterLog.find({ user: userId }).sort({ date: -1 });

        // Set cache
        setCache(cacheKey, logs);

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

        // Invalidate cache
        const userId = req.user.id;
        clearCachePattern(`waterlogs:user:${userId}`);
        clearCachePattern(`history:daily:${userId}`);
        clearCachePattern(`history:weekly:${userId}`);
        clearCachePattern(`history:monthly:${userId}`);
        clearCachePattern(`history:yearly:${userId}`);

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

        // Invalidate cache
        const userId = req.user.id;
        clearCachePattern(`waterlogs:user:${userId}`);
        clearCachePattern(`history:daily:${userId}`);
        clearCachePattern(`history:weekly:${userId}`);
        clearCachePattern(`history:monthly:${userId}`);
        clearCachePattern(`history:yearly:${userId}`);

        res.json({
            status: "success",
            message: "Log air berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
