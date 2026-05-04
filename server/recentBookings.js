import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for reading data
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function checkRecentBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Get all bookings
    const bookings = await Booking.find({});
    console.log(`Total bookings: ${bookings.length}`);
    
    // Filter for recent dates (last 7 days to future)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const recentBookings = bookings.filter(b => {
      if (!b.date) return false;
      const bookingDate = new Date(b.date);
      return bookingDate >= sevenDaysAgo;
    });
    
    console.log(`\nRecent bookings (last 7 days to future): ${recentBookings.length}`);
    
    // Sort by date
    recentBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    recentBookings.forEach((b, index) => {
      console.log(`${index + 1}. ID: ${b._id}`);
      console.log(`   Date: ${b.date}`);
      console.log(`   Time: ${b.timeSlotStart}`);
      console.log(`   Customer ID: ${b.customer}`);
      console.log(`   Verified: ${b.isVerified}`);
      console.log(`   Notify Sent: ${b.notifySent}`);
      console.log('');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkRecentBookings();