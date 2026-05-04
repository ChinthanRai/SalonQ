import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple schema for reading data
const bookingSchema = new mongoose.Schema({}, { strict: false });
const userSchema = new mongoose.Schema({}, { strict: false });

async function checkFutureBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    const Booking = mongoose.model("Booking", bookingSchema);
    const User = mongoose.model("User", userSchema);
    
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Find future verified bookings that haven't received notifications
    const bookings = await Booking.find({ 
      date: { $gte: todayStr },
      isVerified: true, 
      notifySent: false 
    });
    
    console.log(`Future verified bookings without notifications: ${bookings.length}`);
    
    // Sort by date and time
    bookings.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.timeSlotStart.localeCompare(b.timeSlotStart);
    });
    
    console.log("\nUpcoming bookings:");
    for (const b of bookings) {
      console.log(`- Date: ${b.date} Time: ${b.timeSlotStart}`);
      console.log(`  Booking ID: ${b._id}`);
      
      // Get customer info
      if (b.customer) {
        const customer = await User.findById(b.customer);
        if (customer) {
          console.log(`  Customer: ${customer.name} (${customer.email})`);
        }
      }
      
      // Calculate time difference
      const bookingDateTime = new Date(`${b.date}T${b.timeSlotStart}:00`);
      const timeDiff = bookingDateTime - today;
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minsDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      console.log(`  Time until appointment: ${hoursDiff}h ${minsDiff}m`);
      console.log('');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkFutureBookings();