import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for accessing the Booking collection
const bookingSchema = new mongoose.Schema({}, { strict: false });

async function clearAllBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const Booking = mongoose.model("Booking", bookingSchema);
    
    // Count existing bookings
    const countBefore = await Booking.countDocuments();
    console.log(`Current number of bookings: ${countBefore}`);
    
    // Delete all bookings
    const result = await Booking.deleteMany({});
    console.log(`Deleted ${result.deletedCount} bookings`);
    
    // Verify deletion
    const countAfter = await Booking.countDocuments();
    console.log(`Remaining bookings: ${countAfter}`);
    
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

clearAllBookings();