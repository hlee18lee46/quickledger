import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createBillTools(context: ToolContext) {
  const createBill = tool(
    async ({ merchantName, amount, currency, description, dueDate }) => {
      const db = await getDb()

      const bill = {
        userId: context.userId,
        merchantName,
        amount,
        currency: currency || "USD",
        description,
        dueDate: dueDate || "",
        status: "unpaid",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("bills").insertOne(bill)

      return JSON.stringify({
        success: true,
        bill: {
          _id: result.insertedId,
          ...bill,
        },
      })
    },
    {
      name: "create_bill",
      description: "Create a bill that the user needs to pay to a merchant.",
      schema: z.object({
        merchantName: z.string(),
        amount: z.number(),
        currency: z.string().default("USD"),
        description: z.string(),
        dueDate: z.string().optional(),
      }),
    }
  )

  return [createBill]
}