import { sendEmail } from "./utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
  console.log("Testing email sending...");
  
  // Check if email config is properly set
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[SET]" : "[NOT SET]");
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email configuration is missing");
    return;
  }

  try {
    const result = await sendEmail({
      to: "chinthanrai.123@gmail.com",
      subject: "Test Email from Salon Queue System",
      html: "<p>This is a test email to verify that the email system is working correctly.</p>"
    });
    
    console.log("Email send result:", result);
  } catch (error) {
    console.error("Error sending test email:", error.message);
  }
}

testEmail();