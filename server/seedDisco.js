import mongoose from "mongoose";
import Service from "./models/Service.js";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    await Service.create({ name: "disco_test", durationMinutes: 50, price: 2000 });
    console.log("Seeded disco_test service");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}
seed();
