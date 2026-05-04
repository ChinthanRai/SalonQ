import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import Service from "./models/Service.js";
import dotenv from "dotenv";

dotenv.config();

async function testReject() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    const bookings = await Booking.find({ status: 'pending' }).populate('customer').populate('service');
    let found = false;
    for (const b of bookings) {
      if (b.customer && b.customer.email === 'chinthanrai.123@gmail.com') {
        found = true;
        console.log("Found target booking:", b._id, b.status, b.isVerified);
        b.status = 'cancelled';
        try {
          await b.save();
          console.log("Save successful for:", b._id);
        } catch (saveErr) {
          console.error("Save error for", b._id, ":", saveErr.message);
        }
      }
    }
    if (!found) {
      console.log("No pending bookings found for chinthanrai.123@gmail.com");
    }
  } catch (error) {
    console.error("Global error:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

testReject();
