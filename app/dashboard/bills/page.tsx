"use client"

import { Plus, ReceiptText, CreditCard } from "lucide-react"
import { toast } from "sonner"
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
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { bills } from "@/lib/mock-data"

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

export default function BillsPage() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Bills"
          description="Amounts you owe merchants and suppliers."
          action={
            <Button onClick={() => toast.success("New bill drafted")}>
              <Plus data-icon="inline-start" />
              New Bill
            </Button>
          }
        />

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <ReceiptText className="size-4 text-muted-foreground" />
                      {bill.merchant}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {bill.description}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {formatUsd(bill.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(bill.dueDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={bill.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bill.status === "paid"}
                      onClick={() => toast.warning(`Payment to ${bill.merchant} awaiting Ledger approval`)}
                    >
                      <CreditCard data-icon="inline-start" />
                      Pay
                    </Button>
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
