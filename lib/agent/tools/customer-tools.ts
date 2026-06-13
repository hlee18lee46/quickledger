import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createCustomerTools(context: ToolContext) {
  const saveCustomer = tool(
    async ({ name, email, walletAddress, notes }) => {
      const db = await getDb()

      const customer = {
        userId: context.userId,
        name,
        email: email || "",
        walletAddress: walletAddress || "",
        notes: notes || "",
        createdAt: new Date(),
      }

      const result = await db.collection("customers").insertOne(customer)

      return JSON.stringify({
        success: true,
        customerId: result.insertedId,
        customer,
      })
    },
    {
      name: "save_customer",
      description: "Save a customer/client.",
      schema: z.object({
        name: z.string(),
        email: z.string().optional(),
        walletAddress: z.string().optional(),
        notes: z.string().optional(),
      }),
    }
  )

  return [saveCustomer]
}