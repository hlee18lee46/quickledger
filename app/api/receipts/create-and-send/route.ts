// app/api/receipts/create-and-send/route.ts
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"
import clientPromise from "@/lib/mongodb"

async function generateReceiptPdf(payment: any, receiptId: string) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 740

  function line(label: string, value: string) {
    page.drawText(label, {
      x: 50,
      y,
      size: 11,
      font: bold,
      color: rgb(0, 0, 0),
    })

    page.drawText(value || "N/A", {
      x: 190,
      y,
      size: 11,
      font,
      color: rgb(0.15, 0.15, 0.15),
    })

    y -= 24
  }

  page.drawText("QuickLedgerBooks Receipt", {
    x: 50,
    y,
    size: 22,
    font: bold,
  })

  y -= 40

  line("Receipt ID", receiptId)
  line("Merchant", payment.counterpartyName)
  line("ENS", payment.ensName || payment.approvalSummary?.ensName || "")
  line("Resolved Wallet", payment.toWallet)
  line("Amount", `${payment.amount} ${payment.currency}`)
  line("Chain", payment.chain)
  line("Reason", payment.reason)
  line("Transaction Hash", payment.txHash)
  line("Ledger Approved", payment.ledgerApproved ? "Yes" : "No")
  line("From Wallet", payment.fromWallet || "")
  line("Created At", new Date().toLocaleString())

  y -= 20

  page.drawText("This receipt was generated after Ledger-approved payment confirmation.", {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.35, 0.35, 0.35),
  })

  const pdfBytes = await pdfDoc.save()

  const dir = path.join(process.cwd(), "public", "receipts")
  await fs.mkdir(dir, { recursive: true })

  const filename = `receipt-${receiptId}.pdf`
  const filePath = path.join(dir, filename)

  await fs.writeFile(filePath, pdfBytes)

  return {
    filename,
    filePath,
    pdfUrl: `/receipts/${filename}`,
  }
}

async function sendReceiptEmail({
  to,
  subject,
  text,
  filePath,
  filename,
}: {
  to: string
  subject: string
  text: string
  filePath: string
  filename: string
}) {
  if (!process.env.SMTP_HOST) {
    console.log("SMTP not configured. Skipping email.")
    return false
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename,
        path: filePath,
      },
    ],
  })

  return true
}

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "paymentId is required" },
        { status: 400 },
      )
    }

    const client = await clientPromise
    const db = client.db("quickledgerbooks")

    const payment = await db.collection("payments").findOne({
      _id: new ObjectId(paymentId),
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 },
      )
    }

    if (payment.status !== "completed" || !payment.txHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment must be completed before creating receipt",
        },
        { status: 400 },
      )
    }

    const merchant = await db.collection("merchants").findOne({
      userId: payment.userId,
      name: payment.counterpartyName,
    })

    const receiptId = new ObjectId().toString()

    const pdf = await generateReceiptPdf(payment, receiptId)

    const emailTo = merchant?.email || ""
    let emailSent = false

    if (emailTo) {
      emailSent = await sendReceiptEmail({
        to: emailTo,
        subject: `Receipt for ${payment.amount} ${payment.currency} payment`,
        text:
          `Attached is your QuickLedgerBooks receipt.\n\n` +
          `Merchant: ${payment.counterpartyName}\n` +
          `ENS: ${payment.ensName || "N/A"}\n` +
          `Amount: ${payment.amount} ${payment.currency}\n` +
          `Tx Hash: ${payment.txHash}\n`,
        filePath: pdf.filePath,
        filename: pdf.filename,
      })
    }

    const receipt = {
      _id: new ObjectId(receiptId),
      userId: payment.userId,
      paymentId,
      counterparty: payment.counterpartyName,
      ensName: payment.ensName || "",
      amount: payment.amount,
      currency: payment.currency,
      chain: payment.chain,
      txHash: payment.txHash,
      toWallet: payment.toWallet,
      fromWallet: payment.fromWallet || "",
      pdfUrl: pdf.pdfUrl,
      emailTo,
      emailSent,
      createdAt: new Date(),
    }

    await db.collection("receipts").insertOne(receipt)

    return NextResponse.json({
      success: true,
      receipt,
    })
  } catch (error) {
    console.error("Receipt creation failed:", error)

    return NextResponse.json(
      { success: false, error: "Receipt creation failed" },
      { status: 500 },
    )
  }
}