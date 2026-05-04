import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for reading data
const userSchema = new mongoose.Schema({}, { strict: false });
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function checkEmailBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const User = mongoose.model("User", userSchema);
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Find user with your email
    const user = await User.findOne({ email: "chinthanrai.123@gmail.com" });
    if (!user) {
      console.log("User with email chinthanrai.123@gmail.com not found");
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    
    // Find bookings for this user
    const bookings = await Booking.find({ customer: user._id });
    console.log(`\nTotal bookings for this user: ${bookings.length}`);
    
    // Sort by date
    bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    bookings.forEach((b, index) => {
      console.log(`${index + 1}. ID: ${b._id}`);
      console.log(`   Date: ${b.date}`);
      console.log(`   Time: ${b.timeSlotStart}`);
      console.log(`   Verified: ${b.isVerified}`);
      console.log(`   Notify Sent: ${b.notifySent}`);
      console.log('');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkEmailBookings();