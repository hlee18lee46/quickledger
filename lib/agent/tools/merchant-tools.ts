import { tool } from "@langchain/core/tools"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import type { ToolContext } from "./index"

async function getDb() {
  const client = await clientPromise
  return client.db("quickledgerbooks")
}

export function createMerchantTools(context: ToolContext) {
  const saveMerchant = tool(
    async ({ name, email, walletAddress, notes }) => {
      const db = await getDb()

      const existingMerchant = await db.collection("merchants").findOne({
        userId: context.userId,
        name,
      })

      if (existingMerchant) {
        return JSON.stringify({
          success: false,
          message: "Merchant already exists",
          merchant: existingMerchant,
        })
      }

      const merchant = {
        userId: context.userId,
        name,
        email: email || "",
        walletAddress: walletAddress || "",
        notes: notes || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("merchants").insertOne(merchant)

      return JSON.stringify({
        success: true,
        merchantId: result.insertedId,
        merchant,
      })
    },
    {
      name: "save_merchant",
      description:
        "Save a merchant/vendor that the user pays. Stores wallet address and contact information.",
      schema: z.object({
        name: z.string(),
        email: z.string().optional(),
        walletAddress: z.string().optional(),
        notes: z.string().optional(),
      }),
    }
  )

  const findMerchantByName = tool(
    async ({ merchantName }) => {
      const db = await getDb()

      const merchant = await db.collection("merchants").findOne({
        userId: context.userId,
        name: {
          $regex: `^${merchantName}$`,
          $options: "i",
        },
      })

      if (!merchant) {
        return JSON.stringify({
          found: false,
          message: `Merchant '${merchantName}' not found`,
        })
      }

      return JSON.stringify({
        found: true,
        merchant: {
          id: merchant._id,
          name: merchant.name,
          email: merchant.email,
          walletAddress: merchant.walletAddress,
          notes: merchant.notes,
        },
      })
    },
    {
      name: "find_merchant_by_name",
      description:
        "Find a saved merchant by name and return wallet address and contact information. Use this before preparing a payment when the user refers to a merchant by name.",
      schema: z.object({
        merchantName: z.string(),
      }),
    }
  )

  const listMerchants = tool(
    async () => {
      const db = await getDb()

      const merchants = await db
        .collection("merchants")
        .find({
          userId: context.userId,
        })
        .sort({ createdAt: -1 })
        .toArray()

      return JSON.stringify({
        count: merchants.length,
        merchants: merchants.map((m) => ({
          id: m._id,
          name: m.name,
          email: m.email,
          walletAddress: m.walletAddress,
        })),
      })
    },
    {
      name: "list_merchants",
      description: "List all saved merchants/vendors.",
      schema: z.object({}),
    }
  )

  return [
    saveMerchant,
    findMerchantByName,
    listMerchants,
  ]
}