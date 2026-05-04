import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function createTestAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
  const hashed = await bcrypt.hash('testpass123', 10);
  await User.create({ name: 'Test Admin', email: 'testadmin@test.com', password: hashed, role: 'admin' });
  console.log("Created test admin");
  mongoose.connection.close();
}
createTestAdmin();
