// app/api/agent-logs/route.ts
import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB || "quickledgerbooks"

let client: MongoClient | null = null

async function getClient() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }

  return client
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 },
      )
    }

    const client = await getClient()
    const db = client.db(dbName)

    const logs = await db
      .collection("agent_logs")
      .find({
        walletAddress: {
          $regex: `^${walletAddress}$`,
          $options: "i",
        },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Failed to fetch agent logs:", error)

    return NextResponse.json(
      { error: "Failed to fetch agent logs" },
      { status: 500 },
    )
  }
}