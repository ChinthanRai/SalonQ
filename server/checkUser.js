import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function checkUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
  const user = await User.findOne({ email: 'salonq100@gmail.com' });
  console.log("User:", user ? { email: user.email, role: user.role } : 'Not found');
  mongoose.connection.close();
}
checkUser();
