import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service.js";

dotenv.config();

const services = [
  {
    name: "Hair Cut",
    durationMinutes: 30,
    price: 250
  },
  {
    name: "Hair Wash & Conditioning",
    durationMinutes: 20,
    price: 150
  },
  {
    name: "Hair Colour (Global)",
    durationMinutes: 90,
    price: 1500
  },
  {
    name: "Beard Trim / Beard Styling",
    durationMinutes: 15,
    price: 120
  },
  {
    name: "Facial – Basic Cleanup",
    durationMinutes: 45,
    price: 700
  },
  {
    name: "Facial – Premium Glow Facial",
    durationMinutes: 60,
    price: 1200
  },
  {
    name: "Head Massage (Oil Massage)",
    durationMinutes: 25,
    price: 400
  },
  {
    name: "Manicure",
    durationMinutes: 40,
    price: 600
  },
  {
    name: "Pedicure",
    durationMinutes: 45,
    price: 700
  },
  {
    name: "Spa Treatment (Hair Spa / Relaxation)",
    durationMinutes: 90,
    price: 2000
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing services
    await Service.deleteMany({});
    console.log("Existing services cleared");

    // Insert new services
    await Service.insertMany(services);
    console.log("10 services added successfully!");

    // Display added services
    const addedServices = await Service.find({});
    console.log("\nAdded Services:");
    addedServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} - ${service.durationMinutes} mins - ₹${service.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
};

seedServices();
