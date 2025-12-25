import User from "../models/User.js";
import WeightProgress from "../models/WeightProgress.js";
import jwt from "jsonwebtoken";
import { calculateBMI, calculateBMR, calculateDailyCalorieTarget } from "../utils/healthCalculations.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, goal, gender, activityLevel } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: "error", message: "Email sudah terdaftar" });
    }

    const user = await User.create({ name, email, password, age, weight, height, goal, gender, activityLevel });

    // Create initial weight progress entry
    if (weight) {
      await WeightProgress.create({
        user: user._id,
        weight: weight,
        date: new Date(),
        note: "Pencatatan awal saat registrasi"
      });
    }

    res.status(201).json({
      status: "success",
      message: "Registrasi berhasil",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        status: "success",
        message: "Login berhasil",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "Email atau password salah" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const bmi = calculateBMI(user.weight, user.height);
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const calorieTarget = calculateDailyCalorieTarget(bmr, user.activityLevel, user.goal);

    res.json({
      status: "success",
      data: {
        ...user._doc,
        healthAnalysis: {
          bmi,
          bmr,
          dailyCalorieTarget: calorieTarget
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    const { weight } = req.body;

    // If weight is being updated, check if we should create a log
    if (weight && weight !== user.weight) {
      await WeightProgress.create({
        user: user._id,
        weight: weight,
        date: new Date(),
        note: "Perbaruan profil / Onboarding"
      });
    }

    Object.assign(user, req.body);
    await user.save();

    res.json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: user
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};