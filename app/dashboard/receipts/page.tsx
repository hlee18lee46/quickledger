"use client"

import { useEffect, useState } from "react"
import { ScrollText, Download, Mail, MailCheck, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Receipt = {
  _id: string
  paymentId: string
  counterparty: string
  ensName?: string
  amount: number
  currency?: string
  chain?: string
  txHash?: string
  pdfUrl?: string
  emailTo?: string
  emailSent: boolean
  createdAt: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function shortHash(value?: string) {
  if (!value) return "—"
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReceipts() {
      try {
        const res = await fetch("/api/receipts")
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load receipts")
        }

        setReceipts(data.receipts || [])
      } catch (error: any) {
        toast.error(error.message || "Failed to load receipts")
      } finally {
        setLoading(false)
      }
    }

    loadReceipts()
  }, [])

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Receipts"
          description="Generated proof of payment for completed transactions."
        />

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>ENS</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {receipts.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <ScrollText className="size-4 text-muted-foreground" />
                        <span className="font-mono text-xs">
                          {shortHash(r.paymentId)}
                        </span>
                      </span>

                      {r.txHash && (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Tx: {shortHash(r.txHash)}
                        </span>
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {r.counterparty}
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-primary">
                      {r.ensName || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="font-medium text-foreground">
                    {r.amount} {r.currency || "ETH"}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </TableCell>

                  <TableCell>
                    {r.emailSent ? (
                      <Badge
                        variant="outline"
                        className="gap-1 border-success/20 bg-success/15 text-success"
                      >
                        <MailCheck className="size-3" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 text-muted-foreground"
                      >
                        <Mail className="size-3" />
                        Not sent
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.txHash && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="View transaction"
                          onClick={() => {
                            window.open(
                              `https://sepolia.etherscan.io/tx/${r.txHash}`,
                              "_blank",
                            )
                          }}
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                      )}

                      {r.pdfUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Open receipt PDF"
                          onClick={() => {
                            window.open(r.pdfUrl, "_blank")
                          }}
                        >
                          <Download className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Loading receipts...
            </div>
          )}

          {!loading && receipts.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No receipts yet.
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}