import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/User.js";
import Service from "./models/Service.js";

dotenv.config();

async function testApiDelete() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    
    // find admin
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.log("No admin found!");
        return mongoose.connection.close();
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Find disco service (from screenshot)
    const services = await Service.find({ name: 'disco' });
    if (services.length > 0) {
       const s = services[0];
       console.log("Deleting service ID", s._id);
       try {
         const response = await fetch(`http://127.0.0.1:5001/api/services/${s._id}`, {
             method: 'DELETE',
             headers: { 
               'Authorization': `Bearer ${token}`
             }
         });
         const data = await response.json();
         console.log("Status Code:", response.status);
         console.log("Response JSON:", data);
         
         const checkAgain = await Service.findById(s._id);
         console.log("Service in DB after delete:", checkAgain ? "Still there" : "Gone");
       } catch (err) {
         console.error("API fetch error:", err.message);
       }
    } else {
       console.log("disco service not found");
    }
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    mongoose.connection.close();
  }
}

testApiDelete();
