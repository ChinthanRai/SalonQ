import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

import { sendEmail } from "../utils/sendEmail.js";
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;

    // create user logic...

    console.log("🚀 Register route hit");

    // 👉 ADD THIS
    await sendEmail({
      to: email,
      subject: "Test Email",
      text: "Your OTP is 123456"
    });

    console.log("📧 Email function called");

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
