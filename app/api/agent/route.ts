import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { runQuickLedgerAgent } from "@/lib/agent/quickledger-agent"

export async function POST(req: Request) {
  try {
    const { message, userId, walletAddress } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const agentResult = await runQuickLedgerAgent({
      message,
      userId,
      walletAddress,
    })

    const reply = agentResult.reply || "Action completed successfully."
    const tools = agentResult.tools || []

    const client = await clientPromise

    await client.db("quickledgerbooks").collection("agent_logs").insertOne({
      userId,
      walletAddress: walletAddress || "",
      message,
      reply,
      tools,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      reply,
      tools,
    })
  } catch (error) {
    console.error("QuickLedgerBooks agent error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "QuickLedgerBooks agent failed.",
      },
      { status: 500 },
    )
  }
}