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
    const { name, email, password, role } = req.body;

    console.log("🔥 Register route hit:", email);

    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save user with OTP
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      role: role || "customer"
    });

    // send email
    sendEmail({
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is ${otp}</h2>`
    });

    console.log("📧 Email sent");

    // generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Registration successful. Welcome email sent.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔥 Login route hit:", email);

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = generateToken(user._id, user.role || "customer");

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "customer"
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;