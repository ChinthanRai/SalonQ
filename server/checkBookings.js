import Booking from "./models/Booking.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function checkBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    console.log("Connected to database");
    
    // Get all bookings
    const bookings = await Booking.find().populate("customer", "email name").populate("service", "name");
    console.log(`Total bookings: ${bookings.length}`);
    
    // Filter for today's bookings that are verified
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todaysBookings = bookings.filter(b => 
      b.date === todayStr && b.isVerified
    );
    
    console.log(`\nToday's verified bookings: ${todaysBookings.length}`);
    
    todaysBookings.forEach(b => {
      console.log(`- Booking ID: ${b._id}`);
      console.log(`  Customer: ${b.customer?.name} (${b.customer?.email})`);
      console.log(`  Service: ${b.service?.name}`);
      console.log(`  Time: ${b.timeSlotStart}`);
      console.log(`  Notify Sent: ${b.notifySent}`);
      console.log('');
    });
    
    // Check for any bookings with notifySent = true
    const notifiedBookings = bookings.filter(b => b.notifySent);
    console.log(`\nTotal bookings with notifications sent: ${notifiedBookings.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkBookings();