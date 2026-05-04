import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String
}, { strict: false });

async function fixUser() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/salon_queue');
    const User = mongoose.model("User", userSchema);
    
    const email = "salonq100@gmail.com";
    const user = await User.findOne({ email });
    if (user) {
      console.log(`Found user ${email}, deleting...`);
      await User.deleteOne({ email });
      console.log(`Deleted user ${email}. You can now register again.`);
    } else {
      console.log(`User ${email} not found.`);
    }
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
}

fixUser();
