import express from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper function to validate date
const isValidDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is today or in the future
  return selectedDate >= today;
};

// Helper function to check for double booking
const isSlotAvailable = async (serviceId, date, timeSlotStart) => {
  const existingBooking = await Booking.findOne({
    service: serviceId,
    date: date,
    timeSlotStart: timeSlotStart
    // Removed isVerified condition to prevent any double booking
  });
  return !existingBooking;
};

// Create booking and send OTP
router.post("/", protect, async (req, res) => {
  try {
    const { serviceId, date, timeSlotStart } = req.body;

    // Use authenticated user
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not authenticated" });

    // Validate required fields
    if (!serviceId || !date || !timeSlotStart) {
      return res.status(400).json({ message: "Service, date, and time slot are required" });
    }

    // Validate date (must be today or future)
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Cannot book appointments for past dates" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Check for double booking
    const slotAvailable = await isSlotAvailable(serviceId, date, timeSlotStart);
    if (!slotAvailable) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const booking = await Booking.create({
      customer: user._id,
      service: service._id,
      date,
      timeSlotStart,
      otp,
      otpExpiresAt
    });

    // Send email notification (won't break the flow if it fails)
    const emailResult = await sendEmail({
      to: user.email,
      subject: "Your Salon Booking OTP",
      html: `<p>Your OTP for booking on ${date} at ${timeSlotStart} is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });

    const message = emailResult.success 
      ? "Booking created, OTP sent to email" 
      : "Booking created. Note: Failed to send OTP email. Please contact admin.";

    res.status(201).json({ 
      message, 
      bookingId: booking._id
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    // Provide more specific error messages
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Invalid booking data provided" });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ message: "Booking already exists" });
    }
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

// Resend OTP
router.post("/resend-otp", protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.isVerified) return res.json({ message: "Already verified" });

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    booking.otp = otp;
    booking.otpExpiresAt = otpExpiresAt;
    await booking.save();

    const emailResult = await sendEmail({
      to: req.user.email,
      subject: "Your Salon Booking OTP (Resent)",
      html: `<p>Your new OTP for booking on ${booking.date} at ${booking.timeSlotStart} is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });

    const message = emailResult.success 
      ? "OTP resent to email" 
      : "OTP regenerated. Note: Failed to send OTP email. Please contact admin.";

    res.json({ 
      message
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP (customer verification step)
router.post("/verify-otp", protect, async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    const booking = await Booking.findById(bookingId).populate("service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.isVerified) return res.json({ message: "Already verified" });

    if (!booking.otp || booking.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (booking.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    booking.isVerified = true;
    // Don't automatically set status to confirmed - wait for admin approval
    await booking.save();

    res.json({ message: "Booking verified. Awaiting admin confirmation.", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin approve booking
router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("customer", "name email");
      
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.isVerified) return res.status(400).json({ message: "Booking must be verified by customer first" });

    if (booking.isAdminApproved) return res.json({ message: "Booking already approved" });

    booking.isAdminApproved = true;
    booking.status = "confirmed";
    await booking.save();

    // Send confirmation email after admin approval
    if (booking.customer && booking.customer.email) {
      await sendEmail({
        to: booking.customer.email,
        subject: "Booking Confirmed - Salon Service",
        html: `
          <p>Hi ${booking.customer.name},</p>
          <p>Your booking for <strong>${booking.service ? booking.service.name : 'Salon Service'}</strong> on <strong>${booking.date}</strong> at <strong>${booking.timeSlotStart}</strong> has been confirmed by our team!</p>
          <p>We look forward to seeing you at our salon.</p>
          <p>Thank you for choosing our services!</p>
        `
      });
    }

    res.json({ message: "Booking approved and confirmation email sent", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin reject booking
router.post("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("customer", "name email");
      
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    // Send rejection email
    if (booking.customer && booking.customer.email) {
      await sendEmail({
        to: booking.customer.email,
        subject: "Booking Cancelled - Salon Service",
        html: `
          <p>Hi ${booking.customer.name},</p>
          <p>We regret to inform you that your booking for <strong>${booking.service ? booking.service.name : 'Salon Service'}</strong> on <strong>${booking.date}</strong> at <strong>${booking.timeSlotStart}</strong> has been cancelled.</p>
          <p>If you have any questions or would like to reschedule, please contact us.</p>
          <p>Thank you for your understanding.</p>
        `
      });
    }

    res.json({ message: "Booking rejected and notification email sent", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin delete booking
router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("customer", "name email");
      
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Delete the booking from database
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully", bookingId: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my bookings (customer)
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("service")
      .sort({ date: 1, timeSlotStart: 1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: get all bookings
router.get("/", protect, adminOnly, async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("service")
      .populate("customer", "name email")
      .sort({ date: 1, timeSlotStart: 1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin dashboard stats
router.get("/stats", protect, adminOnly, async (_req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const pending = await Booking.countDocuments({ status: "pending" });

    const perService = await Booking.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service"
        }
      },
      { $unwind: "$service" },
      {
        $project: {
          _id: 0,
          serviceName: "$service.name",
          count: 1
        }
      }
    ]);

    res.json({ totalBookings, confirmed, pending, perService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;