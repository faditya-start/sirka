import Program from "../models/Program.js";
import { getCache, setCache, clearCachePattern } from "../utils/cache.js";

export const createProgram = async (req, res) => {
  try {
    const { title, type, description, duration, level, caloriesTarget } = req.body;
    const program = await Program.create({ title, type, description, duration, level, caloriesTarget });

    // Invalidate cache
    clearCachePattern("programs");

    res.status(201).json({
      status: "success",
      message: "Program berhasil ditambahkan",
      data: program,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const cacheKey = "programs:all";
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.json({ status: "success", message: "from cache", data: cachedData });
    }

    const programs = await Program.find();

    setCache(cacheKey, programs);

    res.json({ status: "success", data: programs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const cacheKey = `programs:${req.params.id}`;
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.json({ status: "success", message: "from cache", data: cachedData });
    }

    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });

    setCache(cacheKey, program);

    res.json({ status: "success", data: program });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });

    // Invalidate cache
    clearCachePattern("programs");

    res.json({ status: "success", message: "Program diperbarui", data: program });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });

    // Invalidate cache
    clearCachePattern("programs");

    res.json({ status: "success", message: "Program dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
