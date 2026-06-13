import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("quickledgerbooks")

  const payments = await db
    .collection("payments")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json({
    success: true,
    payments,
  })
}