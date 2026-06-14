import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { JsonRpcProvider } from "ethers"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

const provider = new JsonRpcProvider(process.env.MAINNET_RPC_URL)

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

async function resolveEnsName(ensName: string) {
  if (!ensName || !ensName.endsWith(".eth")) return null
  return provider.resolveName(ensName)
}

export function createPaymentTools(context: ToolContext) {
  const preparePayment = tool(
    async ({ merchantName, toWallet, ensName, amount, currency, chain, reason }) => {
      const db = await getDb()

      const merchant = await db.collection("merchants").findOne({
        userId: context.userId,
        name: {
          $regex: `^${merchantName}$`,
          $options: "i",
        },
      })

      const merchantEnsName = ensName || merchant?.ensName || ""
      const fallbackWallet = toWallet || merchant?.walletAddress || ""

      let resolvedWallet = fallbackWallet
      let ensResolved = false

let ensResolutionError = ""

if (merchantEnsName) {
  try {
    const resolved = await resolveEnsName(merchantEnsName)

    if (resolved) {
      resolvedWallet = resolved
      ensResolved = true
    }
  } catch (error: any) {
    ensResolutionError = error?.message || "ENS resolution failed"
    console.warn("ENS resolution failed, using fallback wallet:", ensResolutionError)
  }
}

      if (!resolvedWallet) {
        return JSON.stringify({
          success: false,
          error: "No wallet address or resolvable ENS name found for merchant.",
          merchantName,
          ensName: merchantEnsName,
        })
      }

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
  ensName: merchantEnsName,
  ensResolved,
  resolvedWallet,
  fallbackWallet,
  ensResolutionError,
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
      ? "This is the first recorded payment to this merchant. Please verify the ENS name and resolved wallet address on your Ledger."
      : `You have paid this merchant ${previousPayments.length} time(s) before. Verify ENS name, amount, and wallet address on Ledger before approving.`,
}

      const payment = {
        userId: context.userId,
        type: "outgoing",
        counterpartyType: "merchant",
        counterpartyName: merchantName,
        ensName: merchantEnsName,
        toWallet: resolvedWallet,
        fallbackWallet,
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
        "Prepare an outgoing crypto payment. If the merchant has an ENS name or user provides an ENS name, resolve it and use the resolved wallet address before Ledger approval.",
      schema: z.object({
        merchantName: z.string(),
        toWallet: z.string().optional(),
        ensName: z.string().optional(),
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