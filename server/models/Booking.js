import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlotStart: { type: String, required: true }, // HH:mm
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    isAdminApproved: { type: Boolean, default: false }, // New field for admin approval
    notifySent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);