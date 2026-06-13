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
  usd: 4820.55,
  eth: 1.42,
  lastFunded: "2 hours ago via Blink",
}

export const merchants: Merchant[] = [
  {
    id: "m1",
    name: "Sami Hardware Labs",
    email: "billing@samihardware.io",
    walletAddress: "0x7a3F...9c21",
    notes: "Primary supplier for hardware parts and prototyping.",
  },
  {
    id: "m2",
    name: "Northwind Cloud Hosting",
    email: "accounts@northwind.cloud",
    walletAddress: "0x4b9E...11aa",
    notes: "Monthly infrastructure and hosting provider.",
  },
  {
    id: "m3",
    name: "BrightPixel Studio",
    email: "hello@brightpixel.design",
    walletAddress: "0xD12c...87f0",
    notes: "Contract design and branding work.",
  },
]

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Alex Consulting",
    email: "alex@alexconsulting.com",
    walletAddress: "0x9F1a...4d77",
    notes: "Retainer client, net-15 payment terms.",
  },
  {
    id: "c2",
    name: "Meridian Retail Co.",
    email: "ap@meridianretail.com",
    walletAddress: "0x22Bc...903e",
    notes: "Quarterly software license renewals.",
  },
  {
    id: "c3",
    name: "Harbor & Co.",
    email: "finance@harborco.com",
    walletAddress: "0x6e0D...c5b2",
    notes: "New client onboarded last month.",
  },
]

export const invoices: Invoice[] = [
  {
    id: "i1",
    invoiceNumber: "INV-1001",
    customer: "Alex Consulting",
    amount: 500,
    dueDate: "2026-06-19",
    status: "unpaid",
    pdfUrl: "#",
  },
  {
    id: "i2",
    invoiceNumber: "INV-1000",
    customer: "Meridian Retail Co.",
    amount: 2400,
    dueDate: "2026-06-05",
    status: "overdue",
    pdfUrl: "#",
  },
  {
    id: "i3",
    invoiceNumber: "INV-0999",
    customer: "Harbor & Co.",
    amount: 1250,
    dueDate: "2026-05-28",
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "i4",
    invoiceNumber: "INV-1002",
    customer: "Alex Consulting",
    amount: 780,
    dueDate: "2026-06-30",
    status: "draft",
    pdfUrl: "#",
  },
]

export const bills: Bill[] = [
  {
    id: "b1",
    merchant: "Sami Hardware Labs",
    amount: 120,
    dueDate: "2026-06-15",
    status: "unpaid",
    description: "Hardware parts — sensors & connectors",
  },
  {
    id: "b2",
    merchant: "Northwind Cloud Hosting",
    amount: 89,
    dueDate: "2026-06-12",
    status: "scheduled",
    description: "June infrastructure invoice",
  },
  {
    id: "b3",
    merchant: "BrightPixel Studio",
    amount: 650,
    dueDate: "2026-06-01",
    status: "overdue",
    description: "Logo and brand kit — milestone 2",
  },
  {
    id: "b4",
    merchant: "Northwind Cloud Hosting",
    amount: 89,
    dueDate: "2026-05-12",
    status: "paid",
    description: "May infrastructure invoice",
  },
]

export const payments: Payment[] = [
  {
    id: "p1",
    type: "outgoing",
    counterparty: "Sami Hardware Labs",
    amount: 0.01,
    chain: "Ethereum",
    txHash: "—",
    ledgerApproved: false,
    status: "pending",
    reason: "Payment for hardware parts (Bill from Sami Hardware Labs)",
  },
  {
    id: "p2",
    type: "outgoing",
    counterparty: "Northwind Cloud Hosting",
    amount: 0.032,
    chain: "Base",
    txHash: "0x8d2a...77b1",
    ledgerApproved: true,
    status: "completed",
    reason: "June hosting invoice",
  },
  {
    id: "p3",
    type: "incoming",
    counterparty: "Harbor & Co.",
    amount: 0.45,
    chain: "Ethereum",
    txHash: "0x3f91...0ac4",
    ledgerApproved: true,
    status: "completed",
    reason: "Invoice INV-0999 settlement",
  },
  {
    id: "p4",
    type: "outgoing",
    counterparty: "BrightPixel Studio",
    amount: 0.21,
    chain: "Polygon",
    txHash: "—",
    ledgerApproved: false,
    status: "pending",
    reason: "Brand kit milestone 2",
  },
]

export const receipts: Receipt[] = [
  {
    id: "r1",
    paymentId: "p2",
    counterparty: "Northwind Cloud Hosting",
    amount: 0.032,
    pdfUrl: "#",
    emailSent: true,
    createdAt: "2026-06-10",
  },
  {
    id: "r2",
    paymentId: "p3",
    counterparty: "Harbor & Co.",
    amount: 0.45,
    pdfUrl: "#",
    emailSent: true,
    createdAt: "2026-06-08",
  },
  {
    id: "r3",
    paymentId: "p2",
    counterparty: "Northwind Cloud Hosting",
    amount: 0.032,
    pdfUrl: "#",
    emailSent: false,
    createdAt: "2026-06-10",
  },
]

export const agentActions: AgentAction[] = [
  {
    id: "a1",
    prompt: "Create invoice for Alex for $500 due next Friday and email it",
    intent: "create_invoice",
    status: "completed",
    requiresLedger: false,
    createdAt: "10 min ago",
  },
  {
    id: "a2",
    prompt: "Pay Sami Hardware Labs 0.01 ETH for hardware parts",
    intent: "send_payment",
    status: "awaiting_approval",
    requiresLedger: true,
    createdAt: "32 min ago",
  },
  {
    id: "a3",
    prompt: "Add Harbor & Co. as a new customer",
    intent: "create_customer",
    status: "completed",
    requiresLedger: false,
    createdAt: "1 hour ago",
  },
  {
    id: "a4",
    prompt: "Generate receipt for the Northwind hosting payment",
    intent: "create_receipt",
    status: "completed",
    requiresLedger: false,
    createdAt: "2 hours ago",
  },
]

export const examplePrompts = [
  "Create invoice for Alex for $500 due next Friday and email it",
  "Pay Sami Hardware Labs 0.01 ETH for hardware parts",
  "Add Harbor & Co. as a new customer with net-15 terms",
  "Show me all overdue bills and schedule payments",
]
