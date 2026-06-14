import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "paymentId is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("quickledgerbooks")

    const payment = await db.collection("payments").findOne({
      _id: new (await import("mongodb")).ObjectId(paymentId),
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      )
    }

    const receipt = {
      userId: payment.userId,
      paymentId,
      counterparty: payment.counterpartyName,
      ensName: payment.ensName || "",
      amount: payment.amount,
      currency: payment.currency,
      chain: payment.chain,
      txHash: payment.txHash,
      toWallet: payment.toWallet,
      pdfUrl: `/receipts/${paymentId}.pdf`,
      emailSent: false,
      createdAt: new Date(),
    }

    await db.collection("receipts").insertOne(receipt)

    console.log("Receipt created:", receipt)

    return NextResponse.json({
      success: true,
      receipt,
    })
  } catch (error) {
    console.error("Receipt creation failed:", error)

    return NextResponse.json(
      { success: false, error: "Receipt creation failed" },
      { status: 500 }
    )
  }
}