import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for reading data
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function checkData() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Get all bookings
    const bookings = await Booking.find({});
    console.log(`Total bookings: ${bookings.length}`);
    
    // Show some sample bookings
    console.log("\nSample bookings:");
    bookings.slice(0, 5).forEach((b, index) => {
      console.log(`${index + 1}. ID: ${b._id}`);
      console.log(`   Date: ${b.date}`);
      console.log(`   Time: ${b.timeSlotStart}`);
      console.log(`   Customer ID: ${b.customer}`);
      console.log(`   Verified: ${b.isVerified}`);
      console.log(`   Notify Sent: ${b.notifySent}`);
      console.log('');
    });
    
    // Count bookings with notifySent = true
    const notifiedCount = bookings.filter(b => b.notifySent === true).length;
    console.log(`\nBookings with notifications sent: ${notifiedCount}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkData();