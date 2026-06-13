import { Wallet, FileText, ReceiptText, ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { walletBalance, invoices, bills, payments } from "@/lib/mock-data"

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function DashboardCards() {
  const unpaidInvoices = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue")
  const unpaidBills = bills.filter((b) => b.status === "unpaid" || b.status === "overdue")
  const pendingApprovals = payments.filter((p) => p.status === "pending")

  const cards = [
    {
      label: "Wallet balance",
      value: formatUsd(walletBalance.usd),
      sub: `${walletBalance.eth} ETH · ${walletBalance.lastFunded}`,
      icon: Wallet,
      tone: "text-primary bg-accent",
    },
    {
      label: "Unpaid invoices",
      value: formatUsd(unpaidInvoices.reduce((s, i) => s + i.amount, 0)),
      sub: `${unpaidInvoices.length} awaiting payment`,
      icon: FileText,
      tone: "text-warning-foreground bg-warning/15",
    },
    {
      label: "Unpaid bills",
      value: formatUsd(unpaidBills.reduce((s, b) => s + b.amount, 0)),
      sub: `${unpaidBills.length} due soon`,
      icon: ReceiptText,
      tone: "text-destructive bg-destructive/10",
    },
    {
      label: "Pending Ledger approvals",
      value: String(pendingApprovals.length),
      sub: "Outgoing payments to sign",
      icon: ShieldAlert,
      tone: "text-primary bg-accent",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="border-border">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className={cn("flex size-9 items-center justify-center rounded-lg", card.tone)}>
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
