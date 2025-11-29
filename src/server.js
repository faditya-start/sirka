import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import foodLogRoutes from "./routes/foodLogRoutes.js";
import activityLogRoutes from "./routes/ActivyLogRoutes.js";  
import programRoutes from "./routes/programRoutes.js";
import weightProgressRoutes from "./routes/weightProgressRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/foodlogs", foodLogRoutes);
app.use("/api/activitylogs", activityLogRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/weightprogress", weightProgressRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("Sirka Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
