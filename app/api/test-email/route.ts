// app/api/test-email/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: "phocle4@gmail.com",
    subject: "QuickLedgerBooks Test",
    text: "If you received this email, SMTP is working.",
  })

  console.log("Accepted:", info.accepted)
  console.log("Rejected:", info.rejected)
  console.log("Message ID:", info.messageId)

  return NextResponse.json({
    success: true,
    accepted: info.accepted,
    rejected: info.rejected,
    messageId: info.messageId,
  })
}