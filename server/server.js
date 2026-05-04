import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// DB
import connectDB from "./config/db.js";

// Models (for scheduler)
import Booking from "./models/Booking.js";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Salon Queue API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// ================= EMAIL DEBUG =================
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

// ================= REMINDER SCHEDULER =================
const REMINDER_MINUTES_BEFORE = 15;

setInterval(async () => {
  try {
    const now = new Date();
    const reminderTime = new Date(
      now.getTime() + REMINDER_MINUTES_BEFORE * 60000
    );

    console.log(
      `Checking for appointments between ${now.toISOString()} and ${reminderTime.toISOString()}`
    );

    const currentDateStr = now.toISOString().slice(0, 10);

    const bookings = await Booking.find({
      isVerified: true,
      notifySent: false,
      date: { $gte: currentDateStr },
    })
      .populate("customer", "email name")
      .populate("service", "name");

    console.log(`Found ${bookings.length} potential bookings`);

    for (const b of bookings) {
      const bookingDateTime = new Date(
        `${b.date}T${b.timeSlotStart}:00`
      );

      if (bookingDateTime > now && bookingDateTime <= reminderTime) {
        console.log(`Sending reminder to ${b.customer.email}`);

        const result = await sendEmail({
          to: b.customer.email,
          subject: "Appointment Reminder - SalonQ",
          html: `
            <h3>Hello ${b.customer.name || "Customer"},</h3>
            <p>Your appointment for <b>${b.service.name}</b></p>
            <p>Date: <b>${b.date}</b></p>
            <p>Time: <b>${b.timeSlotStart}</b></p>
            <p>Please arrive a few minutes early.</p>
            <p>Thank you for choosing SalonQ!</p>
          `,
        });

        if (result.success) {
          b.notifySent = true;
          await b.save();
          console.log(`Reminder sent for booking ${b._id}`);
        } else {
          console.log(`Failed to send reminder for ${b._id}`);
        }
      }
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
}, 60 * 1000);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});