import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {

  try {
    console.log("📩 Sending email to:", to); // ✅ MOVE HERE

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT), // also fix this
      secure: Number(process.env.EMAIL_PORT) === 465,
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

    console.log(`✅ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, message: "Failed to send email" };
  }
};