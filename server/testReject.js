import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import dotenv from "dotenv";

dotenv.config();

async function testReject() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    const bookings = await Booking.find({}).populate('customer');
    console.log("Total bookings:", bookings.length);
    for (const b of bookings) {
      if (b.customer && b.customer.email === 'chinthanrai.123@gmail.com' && b.status === 'pending') {
        console.log("Found target booking:", b._id, b.status, b.isVerified);
        b.status = 'cancelled';
        try {
          await b.save();
          console.log("Save successful!");
        } catch (saveErr) {
          console.error("Save error:", saveErr);
        }
      }
    }
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testReject();
