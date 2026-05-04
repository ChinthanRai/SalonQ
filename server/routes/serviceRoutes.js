import express from "express";
import Service from "../models/Service.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Seed default services
router.post("/seed", async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) return res.json({ message: "Services already seeded" });

    const services = [
      { name: "Hair Cut", durationMinutes: 30, price: 200 },
      { name: "Hair Wash", durationMinutes: 20, price: 150 },
      { name: "Hair Colour", durationMinutes: 90, price: 1500 },
      { name: "Beard Trim", durationMinutes: 15, price: 100 },
      { name: "Facial Basic", durationMinutes: 45, price: 800 },
      { name: "Facial Premium", durationMinutes: 60, price: 1200 },
      { name: "Head Massage", durationMinutes: 30, price: 500 },
      { name: "Manicure", durationMinutes: 40, price: 600 },
      { name: "Pedicure", durationMinutes: 45, price: 700 },
      { name: "Spa Treatment", durationMinutes: 120, price: 2500 }
    ];

    await Service.insertMany(services);
    res.json({ message: "Default services created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin create / update / delete if needed
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
