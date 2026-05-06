import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📩 Sending email to:", to);

    // Render's free tier blocks SMTP ports (587, 465). 
    // We are using Brevo's HTTP API (port 443) which Render allows!
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️ BREVO_API_KEY not found. Please set it in Render dashboard.");
      return { success: false, message: "Email API key missing" };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "SalonQ",
          email: process.env.EMAIL_USER || "salonq100@gmail.com"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    console.log(`✅ Email sent successfully to ${to} via Brevo API`);
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("❌ Failed to send email via Brevo:", error.message);
    return { success: false, message: "Failed to send email" };
  }
};