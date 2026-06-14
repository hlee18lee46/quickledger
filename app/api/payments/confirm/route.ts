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
    page.drawText(label, { x: 50, y, size: 11, font: bold, color: rgb(0, 0, 0) })
    page.drawText(value || "N/A", { x: 190, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) })
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

  page.drawText(
    "This receipt was generated after Ledger-approved payment confirmation.",
    {
      x: 50,
      y,
      size: 10,
      font,
      color: rgb(0.35, 0.35, 0.35),
    },
  )

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

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments: [{ filename, path: filePath }],
  })

  console.log("📧 Email accepted:", info.accepted)
  console.log("📧 Email rejected:", info.rejected)
  console.log("📧 Message ID:", info.messageId)

  return info.accepted?.length > 0
}

export async function PATCH(req: Request) {
  try {
    const { paymentId, txHash, fromWallet } = await req.json()

    if (!paymentId || !txHash) {
      return NextResponse.json(
        { success: false, error: "Missing paymentId or txHash" },
        { status: 400 },
      )
    }

    const client = await clientPromise
    const db = client.db("quickledgerbooks")
    const paymentObjectId = new ObjectId(paymentId)

    await db.collection("payments").updateOne(
      { _id: paymentObjectId },
      {
        $set: {
          txHash,
          fromWallet: fromWallet || "",
          ledgerApproved: true,
          status: "completed",
          updatedAt: new Date(),
        },
      },
    )

    const payment = await db.collection("payments").findOne({
      _id: paymentObjectId,
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found after update" },
        { status: 404 },
      )
    }

    const existingReceipt = await db.collection("receipts").findOne({
      paymentId,
    })

    if (existingReceipt) {
      return NextResponse.json({
        success: true,
        payment,
        receipt: existingReceipt,
        emailSent: existingReceipt.emailSent,
        emailError: existingReceipt.emailError || "",
        message: "Payment confirmed. Receipt already exists.",
      })
    }

    const merchant = await db.collection("merchants").findOne({
      userId: payment.userId,
      name: payment.counterpartyName,
    })

    const receiptId = new ObjectId().toString()
    const pdf = await generateReceiptPdf(payment, receiptId)
    const emailTo = merchant?.email || ""

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
      emailSent: false,
      emailError: "",
      createdAt: new Date(),
    }

    const insertResult = await db.collection("receipts").insertOne(receipt)
    console.log("✅ Receipt inserted:", insertResult.insertedId.toString())

    let emailSent = false
    let emailError = ""

    if (emailTo) {
      try {
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
      } catch (err: any) {
        emailSent = false
        emailError = err?.message || "Email failed"
        console.error("❌ Receipt email failed:", emailError)
      }

      await db.collection("receipts").updateOne(
        { _id: receipt._id },
        {
          $set: {
            emailSent,
            emailError,
            emailedAt: new Date(),
          },
        },
      )

      receipt.emailSent = emailSent
      receipt.emailError = emailError
    } else {
      console.log("No merchant email found. Receipt saved but not emailed.")
    }

    return NextResponse.json({
      success: true,
      payment,
      receipt,
      emailSent,
      emailError,
    })
  } catch (error: any) {
    console.error("Confirm payment failed:", error)

    return NextResponse.json(
      { success: false, error: error?.message || "Confirm failed" },
      { status: 500 },
    )
  }
}