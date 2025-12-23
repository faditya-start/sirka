import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["Diet", "Aktivitas"], required: true },
    description: { type: String },
    duration: { type: Number },
    level: { type: String, enum: ["Pemula", "Menengah", "Lanjut"], default: "Pemula" },
    caloriesTarget: { type: Number }, 
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);
export default Program;
