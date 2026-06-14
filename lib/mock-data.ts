import type {
  AgentAction,
  Bill,
  Customer,
  Invoice,
  Merchant,
  Payment,
  Receipt,
} from "./types"

export const walletBalance = {
  usd: 0,
  eth: 0,
  lastFunded: "QuickLedgerBooks",
}

export const merchants: Merchant[] = []

export const customers: Customer[] = []

export const invoices: Invoice[] = []

export const bills: Bill[] = []

export const payments: Payment[] = []

export const receipts: Receipt[] = []

export const agentActions: AgentAction[] = [
  {
    id: "a1",
    prompt:
      "Welcome to QuickLedgerBooks — safe, fast, and automated payment workflows.",
    intent: "quickledgerbooks",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
  {
    id: "a2",
    prompt:
      "LangChain agent powered by Gemma LLM tool calling for bookkeeping and payment automation.",
    intent: "langchain_agent",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
  {
    id: "a3",
    prompt:
      "Ledger hardware wallet approval secures outgoing crypto payments.",
    intent: "ledger_security",
    status: "completed",
    requiresLedger: true,
    createdAt: "Ready",
  },
  {
    id: "a4",
    prompt:
      "Automatically generate PDF receipts and email vendors after payment.",
    intent: "receipt_automation",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
]

export const examplePrompts = [
  "Pay vitalikkimchi.eth 0.01 ETH for catering",
  "Pay Sysco 0.01 ETH for food delivery",
  "Generate a PDF receipt for my latest payment",
  "Email the receipt to the vendor",
]