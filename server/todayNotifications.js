import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for reading data
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function checkTodayNotifications() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    console.log(`Today's date: ${today}`);
    
    // Find today's verified bookings that haven't received notifications
    const bookings = await Booking.find({ 
      date: today, 
      isVerified: true, 
      notifySent: false 
    });
    
    console.log(`Today's unnotified verified bookings: ${bookings.length}`);
    
    bookings.forEach(b => {
      console.log(`- Booking: ${b._id} Time: ${b.timeSlotStart}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkTodayNotifications();