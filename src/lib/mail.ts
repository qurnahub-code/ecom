// src/lib/mail.ts
import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use the App Password here
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Majestic Admin" <${process.env.GMAIL_USER}>`, // Sender address
      to, // List of receivers
      subject, // Subject line
      html, // HTML body content
    });
    
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}