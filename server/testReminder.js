import dotenv from "dotenv";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();

// Test reminder email
const testReminderEmail = async () => {
  console.log("Sending test reminder email...");
  
  const result = await sendEmail({
    to: "chinthanrai.123@gmail.com",
    subject: "Appointment Reminder - Salon Service (TEST)",
    html: `
      <p>Hi Chinthan,</p>
      <p>This is a friendly reminder that your <strong>Hair Cut</strong> appointment 
      is scheduled for <strong>2025-12-07</strong> at <strong>14:30</strong>.</p>
      <p>Please arrive a few minutes early to ensure a smooth experience.</p>
      <p>Thank you for choosing our salon!</p>
      <br>
      <p style="color: #999; font-size: 0.9em;">This is a test email from SALONQ reminder system.</p>
    `
  });

  if (result.success) {
    console.log("✅ Test reminder email sent successfully!");
    console.log("Check chinthanrai.123@gmail.com inbox");
  } else {
    console.error("❌ Failed to send test email:", result.error);
  }
  
  process.exit(0);
};

testReminderEmail();
