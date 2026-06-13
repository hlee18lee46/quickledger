import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createInvoiceTools(context: ToolContext) {
  const createInvoice = tool(
    async ({ customerName, amount, currency, description, dueDate }) => {
      const db = await getDb()

      const invoice = {
        userId: context.userId,
        invoiceNumber: `INV-${Date.now()}`,
        customerName,
        amount,
        currency,
        description,
        dueDate,
        status: "draft",
        createdAt: new Date(),
      }

      const result = await db.collection("invoices").insertOne(invoice)

      return JSON.stringify({
        success: true,
        invoiceId: result.insertedId,
        invoice,
      })
    },
    {
      name: "create_invoice",
      description: "Create an invoice.",
      schema: z.object({
        customerName: z.string(),
        amount: z.number(),
        currency: z.string(),
        description: z.string(),
        dueDate: z.string().optional(),
      }),
    }
  )

  return [createInvoice]
}