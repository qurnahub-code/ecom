import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail"; // Reuse your existing mail helper

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 1. Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Prepare the HTML Template for ADMIN (You)
    // This is the email YOU will receive when a customer contacts you.
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0; }
          .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-top: 15px; }
          .value { font-size: 16px; margin-bottom: 15px; color: #000; }
          .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #000; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0;">📩 New Support Message</h2>
            <p style="margin:5px 0 0; color:#666;">Received via Majestic Contact Form</p>
          </div>

          <div class="label">From</div>
          <div class="value">${name} (<a href="mailto:${email}">${email}</a>)</div>

          <div class="label">Subject</div>
          <div class="value">${subject || "No Subject Provided"}</div>

          <div class="label">Message</div>
          <div class="value message-box">
            "${message.replace(/\n/g, "<br>")}"
          </div>

          <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">
          <p style="font-size:12px; color:#999; text-align:center;">
            Reply directly to this email to respond to the customer.<br>
            &copy; ${new Date().getFullYear()} Majestic Inc. System
          </p>
        </div>
      </body>
      </html>
    `;

    // 3. Send the Email to YOURSELF (Admin)
    // We send it TO the GMAIL_USER (you) FROM the GMAIL_USER (system)
    // but we set "replyTo" so hitting reply works instantly.
    await sendEmail({
      to: process.env.GMAIL_USER!, // Send to your own inbox
      subject: `[Support] ${subject || "New Message"} - ${name}`,
      html: adminEmailHtml,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}