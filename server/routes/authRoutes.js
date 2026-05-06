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
    const { name, email, password } = req.body;

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
    });

    // send email
    await sendEmail({
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is ${otp}</h2>`
    });

    console.log("📧 Email sent");

    res.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;