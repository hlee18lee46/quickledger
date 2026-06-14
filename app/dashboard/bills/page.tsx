"use client"

import { useEffect, useMemo, useState } from "react"
import { ReceiptText, TrendingUp, ShieldCheck, Clock } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Payment = {
  _id: string
  id?: string
  type: string
  counterpartyName?: string
  counterparty?: string
  amount: number
  currency?: string
  chain?: string
  reason?: string
  status: string
  txHash?: string
  createdAt?: string
}

function formatDate(d?: string) {
  if (!d) return "N/A"
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function shortTx(hash?: string) {
  if (!hash) return "No tx"
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}

export default function BillsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch("/api/payments")
        const data = await res.json()
        setPayments(data.payments || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  const expenses = useMemo(
    () => payments.filter((p) => p.type === "outgoing"),
    [payments]
  )

  const totalEth = expenses.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const completed = expenses.filter((p) => p.status === "completed")
  const pending = expenses.filter((p) => p.status === "pending_ledger_approval")

  const byVendor = useMemo(() => {
    const map = new Map<string, number>()

    for (const p of expenses) {
      const vendor = p.counterpartyName || p.counterparty || "Unknown Vendor"
      map.set(vendor, (map.get(vendor) || 0) + Number(p.amount || 0))
    }

    return Array.from(map.entries())
      .map(([vendor, amount]) => ({ vendor, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses])

  const maxVendorAmount = Math.max(...byVendor.map((v) => v.amount), 0)

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Expenses"
          description="Visualize outgoing payments from your payments collection."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total outgoing</p>
                <p className="text-2xl font-semibold">
                  {totalEth.toFixed(4)} ETH
                </p>
              </div>
              <TrendingUp className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold">{completed.length}</p>
              </div>
              <ShieldCheck className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Ledger</p>
                <p className="text-2xl font-semibold">{pending.length}</p>
              </div>
              <Clock className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense by vendor</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading expenses...
              </p>
            ) : byVendor.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No outgoing expenses found.
              </p>
            ) : (
              byVendor.map((item) => (
                <div key={item.vendor} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.vendor}</span>
                    <span className="font-mono">
                      {item.amount.toFixed(4)} ETH
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${
                          maxVendorAmount
                            ? (item.amount / maxVendorAmount) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tx</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {expenses.map((payment) => (
                <TableRow key={payment._id || payment.id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <ReceiptText className="size-4 text-muted-foreground" />
                      {payment.counterpartyName ||
                        payment.counterparty ||
                        "Unknown Vendor"}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {payment.reason || "Outgoing payment"}
                  </TableCell>

                  <TableCell className="font-medium text-foreground">
                    {payment.amount} {payment.currency || "ETH"}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {payment.txHash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${payment.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {shortTx(payment.txHash)}
                      </a>
                    ) : (
                      "No tx"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  )
}