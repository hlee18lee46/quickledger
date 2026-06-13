import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  const client = await clientPromise
  const db = client.db("quickledgerbooks")

  const query = userId ? { userId } : {}

  const merchants = await db
    .collection("merchants")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json({
    success: true,
    merchants,
  })
}