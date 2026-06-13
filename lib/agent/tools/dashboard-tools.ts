import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createDashboardTools(context: ToolContext) {
  const getDashboardSummary = tool(
    async () => {
      const db = await getDb()

      const merchants = await db
        .collection("merchants")
        .countDocuments({ userId: context.userId })

      const customers = await db
        .collection("customers")
        .countDocuments({ userId: context.userId })

      const invoices = await db
        .collection("invoices")
        .countDocuments({ userId: context.userId })

      const payments = await db
        .collection("payments")
        .countDocuments({ userId: context.userId })

      return JSON.stringify({
        merchants,
        customers,
        invoices,
        payments,
      })
    },
    {
      name: "get_dashboard_summary",
      description: "Get dashboard statistics.",
      schema: z.object({}),
    }
  )

  return [getDashboardSummary]
}