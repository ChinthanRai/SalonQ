import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

dotenv.config();

async function testApiReject() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    
    // find admin
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.log("No admin found!");
        return mongoose.connection.close();
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Find Chinthan booking
    const bookings = await Booking.find({}).populate('customer');
    let b = bookings.find(x => x.customer && x.customer.email === 'chinthanrai.123@gmail.com');
    if (!b) b = bookings[0]; // fallback
    
    if (b) {
       console.log("Rejecting booking ID", b._id);
       try {
         const response = await fetch(`http://127.0.0.1:5001/api/bookings/reject/${b._id}`, {
             method: 'POST',
             headers: { 
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
             }
         });
         const data = await response.json();
         console.log("Status Code:", response.status);
         console.log("Response JSON:", data);
       } catch (err) {
         console.error("API fetch error:", err.message);
       }
    }
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    mongoose.connection.close();
  }
}

testApiReject();
