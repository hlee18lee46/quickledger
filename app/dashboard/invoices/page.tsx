"use client"

import { useState } from "react"
import { Plus, FileText, Download } from "lucide-react"
import { toast } from "sonner"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { InvoicePreviewDialog } from "@/components/invoice-preview-dialog"
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
import { invoices } from "@/lib/mock-data"

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function InvoicesPage() {
  const [preview, setPreview] = useState(false)

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Invoices"
          description="Bills you send to customers for payment."
          action={
            <Button onClick={() => setPreview(true)}>
              <Plus data-icon="inline-start" />
              New Invoice
            </Button>
          }
        />

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      {inv.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inv.customer}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {formatUsd(inv.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.dueDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Download invoice PDF"
                      onClick={() => toast.success(`${inv.invoiceNumber} PDF downloaded`)}
                    >
                      <Download className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <InvoicePreviewDialog open={preview} onOpenChange={setPreview} />
    </AppShell>
  )
}
