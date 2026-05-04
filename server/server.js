import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import Booking from "./models/Booking.js";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (_req, res) => {
  res.send("Salon Queue API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// Appointment reminder scheduler: check every minute
const REMINDER_MINUTES_BEFORE = 15;

setInterval(async () => {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + REMINDER_MINUTES_BEFORE * 60000);
    
    console.log(`Checking for appointments between ${now.toISOString()} and ${reminderTime.toISOString()}`);
    
    // Build date and time strings for range compare
    const currentDateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const bookings = await Booking.find({
      isVerified: true,
      notifySent: false,
      date: { $gte: currentDateStr } // Only future bookings
    }).populate("customer", "email name").populate("service", "name");

    console.log(`Found ${bookings.length} potential bookings for reminders`);

    for (const b of bookings) {
      // Combine date + time into a Date
      const bookingDateTime = new Date(`${b.date}T${b.timeSlotStart}:00`);
      
      // Check if booking is within reminder window (15 mins before)
      if (bookingDateTime > now && bookingDateTime <= reminderTime) {
        console.log(`Sending reminder for booking ${b._id} to ${b.customer.email}`);
        const emailResult = await sendEmail({
          to: b.customer.email,
          subject: "Appointment Reminder - Salon Service",
          html: `
            <p>Hi ${b.customer.name || ""},</p>
            <p>This is a friendly reminder that your <strong>${b.service.name}</strong> appointment 
            is scheduled for <strong>${b.date}</strong> at <strong>${b.timeSlotStart}</strong>.</p>
            <p>Please arrive a few minutes early to ensure a smooth experience.</p>
            <p>Thank you for choosing our salon!</p>
          `
        });
        
        if (emailResult.success) {
          console.log(`Reminder email sent to ${b.customer.email} for booking ${b._id}`);
          b.notifySent = true;
          await b.save();
        } else {
          console.error(`Failed to send reminder email to ${b.customer.email} for booking ${b._id}`);
        }
      } else {
        console.log(`Booking ${b._id} is not within reminder window. Booking time: ${bookingDateTime.toISOString()}, Current time: ${now.toISOString()}, Reminder time: ${reminderTime.toISOString()}`);
      }
    }
  } catch (err) {
    console.error("Reminder scheduler error:", err.message);
  }
}, 60 * 1000); // Check every minute

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
