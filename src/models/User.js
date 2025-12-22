import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: false },
    gender: { type: String, enum: ["pria", "wanita"], required: false },
    weight: { type: Number, required: false },
    height: { type: Number, required: false },
    goal: { type: String, enum: ["Turun Berat Badan", "Maintain", "Naik Berat Badan"], required: false },
    activityLevel: {
      type: Number,
      default: 1.2, // Sedentary (little or no exercise)
      required: false
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method untuk cek password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
