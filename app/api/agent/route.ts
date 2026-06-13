import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { runQuickLedgerAgent } from "@/lib/agent/quickledger-agent"

export async function POST(req: Request) {
  try {
    const { message, userId, walletAddress } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const safeUserId = userId || "demo-user"

    const reply = await runQuickLedgerAgent({
      message,
      userId: safeUserId,
      walletAddress,
    })

    const client = await clientPromise
    await client.db("quickledgerbooks").collection("agent_logs").insertOne({
      userId: safeUserId,
      walletAddress: walletAddress || "",
      message,
      reply,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      reply,
    })
  } catch (error) {
    console.error("QuickLedgerBooks agent error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "QuickLedgerBooks agent failed.",
      },
      { status: 500 }
    )
  }
}