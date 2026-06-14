// app/api/receipts/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("quickledgerbooks")

    const receipts = await db
      .collection("receipts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({
      success: true,
      receipts,
    })
  } catch (error) {
    console.error("Failed to fetch receipts:", error)

    return NextResponse.json(
      { success: false, error: "Failed to fetch receipts" },
      { status: 500 },
    )
  }
}