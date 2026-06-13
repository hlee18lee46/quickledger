import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createPaymentTools(context: ToolContext) {
  const preparePayment = tool(
    async ({ merchantName, toWallet, amount, currency, chain, reason }) => {
      const db = await getDb()

      const previousPayments = await db
        .collection("payments")
        .find({
          userId: context.userId,
          counterpartyName: merchantName,
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()

      const totalPaidBefore = previousPayments.reduce(
        (sum, p: any) => sum + Number(p.amount || 0),
        0
      )

      const riskLevel =
        previousPayments.length === 0
          ? "medium"
          : amount > totalPaidBefore * 2 && totalPaidBefore > 0
            ? "medium"
            : "low"

      const approvalSummary = {
        merchantName,
        toWallet,
        amount,
        currency,
        chain,
        reason,
        previousPaymentCount: previousPayments.length,
        totalPaidBefore,
        riskLevel,
        ledgerRequired: true,
        explanation:
          previousPayments.length === 0
            ? "This is the first recorded payment to this merchant. Please verify the wallet address on your Ledger."
            : `You have paid this merchant ${previousPayments.length} time(s) before. Verify amount and wallet address on Ledger before approving.`,
      }

      const payment = {
        userId: context.userId,
        type: "outgoing",
        counterpartyType: "merchant",
        counterpartyName: merchantName,
        toWallet: toWallet || "",
        amount,
        currency,
        chain,
        reason,
        status: "pending_ledger_approval",
        ledgerApproved: false,
        txHash: "",
        approvalSummary,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("payments").insertOne(payment)

      return JSON.stringify({
        success: true,
        paymentId: result.insertedId,
        status: "pending_ledger_approval",
        approvalSummary,
        warning:
          "Payment prepared only. Ledger approval is required before broadcasting.",
      })
    },
    {
      name: "prepare_payment",
      description:
        "Prepare an outgoing crypto payment with merchant history and risk summary. Never sends funds. Requires Ledger approval.",
      schema: z.object({
        merchantName: z.string(),
        toWallet: z.string().optional(),
        amount: z.number(),
        currency: z.string(),
        chain: z.string(),
        reason: z.string(),
      }),
    }
  )

  const getMerchantPaymentHistory = tool(
    async ({ merchantName }) => {
      const db = await getDb()

      const payments = await db
        .collection("payments")
        .find({
          userId: context.userId,
          counterpartyName: merchantName,
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray()

      return JSON.stringify({
        merchantName,
        count: payments.length,
        payments,
      })
    },
    {
      name: "get_merchant_payment_history",
      description: "Get payment history for a merchant before preparing a new payment.",
      schema: z.object({
        merchantName: z.string(),
      }),
    }
  )

  return [preparePayment, getMerchantPaymentHistory]
}