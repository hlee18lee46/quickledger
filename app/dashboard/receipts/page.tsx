"use client"

import { ScrollText, Download, Mail, MailCheck } from "lucide-react"
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
import { receipts } from "@/lib/mock-data"

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ReceiptsPage() {
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
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <ScrollText className="size-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{r.paymentId.toUpperCase()}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.counterparty}</TableCell>
                  <TableCell className="font-medium text-foreground">{r.amount} ETH</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    {r.emailSent ? (
                      <Badge variant="outline" className="gap-1 border-success/20 bg-success/15 text-success">
                        <MailCheck className="size-3" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <Mail className="size-3" />
                        Not sent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!r.emailSent && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Email receipt"
                          onClick={() => toast.success(`Receipt emailed to ${r.counterparty}`)}
                        >
                          <Mail className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Download receipt PDF"
                        onClick={() => toast.success("Receipt PDF downloaded")}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {receipts.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No receipts yet.
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}
