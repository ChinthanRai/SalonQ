import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
