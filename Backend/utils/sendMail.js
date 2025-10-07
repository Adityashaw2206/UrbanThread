import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("❌ EMAIL_USER or EMAIL_PASS is missing in .env");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"UrbanThread" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
