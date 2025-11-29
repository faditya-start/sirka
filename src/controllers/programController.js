import Program from "../models/Program.js";

export const createProgram = async (req, res) => {
  try {
    const { title, type, description, duration, level, caloriesTarget } = req.body;
    const program = await Program.create({ title, type, description, duration, level, caloriesTarget });
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
    const programs = await Program.find();
    res.json({ status: "success", data: programs });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });
    res.json({ status: "success", data: program });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });
    res.json({ status: "success", message: "Program diperbarui", data: program });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ status: "error", message: "Program tidak ditemukan" });
    res.json({ status: "success", message: "Program dihapus" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
