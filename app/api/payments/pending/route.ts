import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || "demo-user"

  const client = await clientPromise
  const db = client.db("quickledgerbooks")

  const payment = await db.collection("payments").findOne(
    {
      userId,
      status: "pending_ledger_approval",
    },
    {
      sort: { createdAt: -1 },
    }
  )

  return NextResponse.json({
    success: true,
    payment,
  })
}