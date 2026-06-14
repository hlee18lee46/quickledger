export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft"
export type BillStatus = "paid" | "unpaid" | "overdue" | "scheduled"
export type PaymentStatus = "pending" | "approved" | "completed" | "failed"
export type AgentStatus = "completed" | "pending" | "failed" | "awaiting_approval"
export type Chain = "Ethereum" | "Base" | "Polygon" | "Arbitrum"

export interface Merchant {
  id: string
  name: string
  email: string
  ensName?: string
  walletAddress: string
  notes: string
}

export interface Customer {
  id: string
  name: string
  email: string
  ensName?: string
  walletAddress: string
  notes: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  amount: number
  dueDate: string
  status: InvoiceStatus
  pdfUrl: string
}

export interface Bill {
  id: string
  merchant: string
  amount: number
  dueDate: string
  status: BillStatus
  description: string
}

export interface Payment {
  id: string
  type: "incoming" | "outgoing"
  counterparty: string
  amount: number
  chain: Chain
  txHash: string
  ledgerApproved: boolean
  status: PaymentStatus
  reason: string
}

export interface Receipt {
  id: string
  paymentId: string
  counterparty: string
  amount: number
  pdfUrl: string
  emailSent: boolean
  createdAt: string
}

export interface AgentAction {
  id: string
  prompt: string
  intent: string
  status: AgentStatus
  requiresLedger: boolean
  createdAt: string
}
