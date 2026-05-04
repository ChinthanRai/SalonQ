import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schemas for accessing collections
const userSchema = new mongoose.Schema({}, { strict: false });
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function clearAllUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const User = mongoose.model("User", userSchema);
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Count existing users and bookings
    const userCountBefore = await User.countDocuments();
    const bookingCountBefore = await Booking.countDocuments();
    console.log(`Current number of users: ${userCountBefore}`);
    console.log(`Current number of bookings: ${bookingCountBefore}`);
    
    // Delete all users except the admin user (if you want to keep admin)
    // For now, I'm deleting all users to give you a completely fresh start
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);
    
    // Verify deletion
    const userCountAfter = await User.countDocuments();
    const bookingCountAfter = await Booking.countDocuments();
    console.log(`Remaining users: ${userCountAfter}`);
    console.log(`Remaining bookings: ${bookingCountAfter}`);
    
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

clearAllUsers();