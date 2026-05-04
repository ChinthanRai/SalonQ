import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  // If email configuration is not set or using placeholder values, log a warning and return
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER.includes('youremail') || 
      process.env.EMAIL_PASS === 'yourapppassword' ||
      process.env.EMAIL_PASS === 'your-app-password' ||
      process.env.EMAIL_PASS === 'your-real-16-character-app-password' ||
      process.env.EMAIL_USER.includes('your-salon-email')) {
    console.warn("Email configuration not properly set. Skipping email sending.");
    console.warn("Please configure EMAIL_USER and EMAIL_PASS in your .env file with valid Gmail credentials.");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // important for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Failed to send email:", error.message);
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Please check your email credentials.");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused. Please check your SMTP settings.");
    }
    // Don't throw the error to prevent breaking the main flow
    return { success: false, message: "Failed to send email" };
  }
};

