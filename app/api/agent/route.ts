import { NextResponse } from "next/server"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages"
import { tool } from "@langchain/core/tools"
import { z } from "zod"

function extractText(content: any): string {
  if (typeof content === "string") return content
  if (Array.isArray(content)) {
    const textPart = content.find((part: any) => part.type === "text")
    return typeof textPart?.text === "string"
      ? textPart.text
      : JSON.stringify(content)
  }
  return JSON.stringify(content)
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemma-4-26b-a4b-it",
      temperature: 0.2,
      apiKey: process.env.GOOGLE_API_KEY,
    })

    const saveMerchant = tool(
      async ({ name, email, walletAddress, notes }) => {
        return JSON.stringify({
          success: true,
          action: "save_merchant",
          merchant: {
            id: crypto.randomUUID(),
            name,
            email,
            walletAddress,
            notes,
            createdAt: new Date().toISOString(),
          },
        })
      },
      {
        name: "save_merchant",
        description: "Save a merchant that the user needs to pay.",
        schema: z.object({
          name: z.string(),
          email: z.string().optional(),
          walletAddress: z.string().optional(),
          notes: z.string().optional(),
        }),
      }
    )

    const saveCustomer = tool(
      async ({ name, email, walletAddress, notes }) => {
        return JSON.stringify({
          success: true,
          action: "save_customer",
          customer: {
            id: crypto.randomUUID(),
            name,
            email,
            walletAddress,
            notes,
            createdAt: new Date().toISOString(),
          },
        })
      },
      {
        name: "save_customer",
        description: "Save a customer that needs to pay the user.",
        schema: z.object({
          name: z.string(),
          email: z.string().optional(),
          walletAddress: z.string().optional(),
          notes: z.string().optional(),
        }),
      }
    )

    const createInvoice = tool(
      async ({ customerName, amount, currency, description, dueDate }) => {
        return JSON.stringify({
          success: true,
          action: "create_invoice",
          invoice: {
            id: crypto.randomUUID(),
            invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName,
            amount,
            currency,
            description,
            dueDate,
            status: "draft",
            pdfStatus: "not_generated_yet",
            createdAt: new Date().toISOString(),
          },
        })
      },
      {
        name: "create_invoice",
        description: "Create a draft invoice for a customer.",
        schema: z.object({
          customerName: z.string(),
          amount: z.number(),
          currency: z.string().default("USD"),
          description: z.string(),
          dueDate: z.string().optional(),
        }),
      }
    )

    const preparePayment = tool(
      async ({ merchantName, amount, currency, chain, reason }) => {
        return JSON.stringify({
          success: true,
          action: "prepare_payment",
          payment: {
            id: crypto.randomUUID(),
            type: "outgoing",
            merchantName,
            amount,
            currency,
            chain,
            reason,
            status: "pending_ledger_approval",
            ledgerApproved: false,
            txHash: null,
            createdAt: new Date().toISOString(),
          },
          warning:
            "Payment prepared only. Ledger approval is required before broadcasting.",
        })
      },
      {
        name: "prepare_payment",
        description:
          "Prepare an outgoing crypto payment. Never broadcasts funds. Requires Ledger approval.",
        schema: z.object({
          merchantName: z.string(),
          amount: z.number(),
          currency: z.string(),
          chain: z.string().default("Base Sepolia"),
          reason: z.string(),
        }),
      }
    )

    const tools = [saveMerchant, saveCustomer, createInvoice, preparePayment]
    const modelWithTools = model.bindTools(tools)

    let messages: BaseMessage[] = [
      new SystemMessage(`
You are QuickLedgerBooks, a prompt-based AI bookkeeping and crypto payment agent.

You help users:
- save merchants they need to pay
- save customers who need to pay them
- create invoices
- prepare outgoing crypto payments

Important:
- Never say a payment was sent.
- You can only prepare payments.
- Outgoing payments must stay pending Ledger approval.
- Be concise and return a useful summary of what happened.
`),
      new HumanMessage(message),
    ]

    let result = await modelWithTools.invoke(messages)

    while (result.tool_calls && result.tool_calls.length > 0) {
      messages.push(result)

      for (const toolCall of result.tool_calls) {
        const selectedTool = tools.find((t) => t.name === toolCall.name)

        if (selectedTool) {
          const toolResponse = await (selectedTool as any).invoke(toolCall.args)

          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id!,
              content: toolResponse,
            })
          )
        }
      }

      result = await modelWithTools.invoke(messages)
    }

    const reply = extractText(result.content)

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