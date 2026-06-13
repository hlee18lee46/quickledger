import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PATCH(req: Request) {
  try {
    const { paymentId, txHash, fromWallet } = await req.json()

    if (!paymentId || !txHash) {
      return NextResponse.json(
        { error: "Missing paymentId or txHash" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("quickledgerbooks")

    const result = await db.collection("payments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          txHash,
          fromWallet: fromWallet || "",
          ledgerApproved: true,
          status: "completed",
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      success: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Confirm failed" },
      { status: 500 }
    )
  }
}