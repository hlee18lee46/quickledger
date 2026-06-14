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
  lastFunded: "Agent-powered business wallet",
}

export const merchants: Merchant[] = [
  {
    id: "m1",
    name: "ENS Vendor",
    email: "vendor@example.com",
    walletAddress: "vendor.eth",
    notes: "Vendor can be resolved through ENS before payment.",
  },
  {
    id: "m2",
    name: "Business Supplier",
    email: "billing@supplier.example",
    walletAddress: "0x0000...0000",
    notes: "Supplier payments can be prepared by the agent.",
  },
  {
    id: "m3",
    name: "Hardware Vendor",
    email: "billing@hardware.example",
    walletAddress: "0x0000...0000",
    notes: "Outgoing payments require Ledger approval.",
  },
]

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Business Customer",
    email: "customer@example.com",
    walletAddress: "0x0000...0000",
    notes: "Customer invoices can be created and emailed by the agent.",
  },
]

export const invoices: Invoice[] = [
  {
    id: "i1",
    invoiceNumber: "INV-DEMO",
    customer: "Business Customer",
    amount: 0,
    dueDate: "2026-06-14",
    status: "draft",
    pdfUrl: "#",
  },
]

export const bills: Bill[] = [
  {
    id: "b1",
    merchant: "ENS Vendor",
    amount: 0,
    dueDate: "2026-06-14",
    status: "scheduled",
    description: "Agent-prepared vendor payment workflow",
  },
  {
    id: "b2",
    merchant: "Business Supplier",
    amount: 0,
    dueDate: "2026-06-14",
    status: "scheduled",
    description: "Payment can be approved securely with Ledger",
  },
]

export const payments: Payment[] = [
  {
    id: "p1",
    type: "outgoing",
    counterparty: "ENS Vendor",
    amount: 0,
    chain: "ethereum",
    txHash: "—",
    ledgerApproved: false,
    status: "pending_ledger_approval",
    reason: "Agent-prepared payment awaiting Ledger approval",
  },
]

export const receipts: Receipt[] = [
  {
    id: "r1",
    paymentId: "p1",
    counterparty: "ENS Vendor",
    amount: 0,
    pdfUrl: "#",
    emailSent: false,
    createdAt: "2026-06-14",
  },
]

export const agentActions: AgentAction[] = [
  {
    id: "a1",
    prompt:
      "Welcome to QuickLedgerBooks — unleash your safe, fast, automatic workflow for payments, receipt saving, and vendor emails.",
    intent: "quickledger_intro",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
  {
    id: "a2",
    prompt:
      "LangChain agent powered by Gemma LLM tool calling prepares payment workflows from natural language prompts.",
    intent: "agent_tool_calling",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
  {
    id: "a3",
    prompt:
      "Ledger hardware approval keeps outgoing crypto payments secure before funds leave the wallet.",
    intent: "ledger_security",
    status: "completed",
    requiresLedger: true,
    createdAt: "Ready",
  },
  {
    id: "a4",
    prompt:
      "After payment, QuickLedgerBooks can generate a PDF receipt, save it, and email it to the vendor.",
    intent: "receipt_email_automation",
    status: "completed",
    requiresLedger: false,
    createdAt: "Ready",
  },
]

export const examplePrompts = [
  "Pay vitalikkimchi.eth 0.01 ETH for catering",
  "Generate a receipt for my latest completed payment",
  "Email the receipt to the vendor",
  "Create an invoice and send it to the customer",
]