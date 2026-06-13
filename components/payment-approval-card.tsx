"use client"

import { useState } from "react"
import { ShieldCheck, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import type { Payment } from "@/lib/types"

export function PaymentApprovalCard({ payment }: { payment: Payment }) {
  const [status, setStatus] = useState(payment.status)
  const [approved, setApproved] = useState(payment.ledgerApproved)
  const [open, setOpen] = useState(false)
  const [signing, setSigning] = useState(false)

  const Icon = payment.type === "outgoing" ? ArrowUpRight : ArrowDownLeft

  function confirmWithLedger() {
    setSigning(true)
    setTimeout(() => {
      setSigning(false)
      setApproved(true)
      setStatus("completed")
      setOpen(false)
      toast.success(`Payment to ${payment.counterparty} approved on Ledger`)
    }, 1500)
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base">{payment.counterparty}</CardTitle>
              <p className="text-xs text-muted-foreground">{payment.chain}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-lg font-semibold text-foreground">
            {payment.amount} ETH
          </span>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">{payment.reason}</p>

        {payment.type === "outgoing" && status === "pending" ? (
          <Button onClick={() => setOpen(true)} className="w-full">
            <ShieldCheck data-icon="inline-start" />
            Approve with Ledger
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            <ShieldCheck className="size-4" />
            {approved ? "Approved on Ledger" : "Settled"}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Confirm on your Ledger
            </DialogTitle>
            <DialogDescription>
              Verify the transaction details on your hardware device before signing.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Recipient</dt>
              <dd className="text-right font-medium text-foreground">{payment.counterparty}</dd>
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-right font-medium text-foreground">{payment.amount} ETH</dd>
              <dt className="text-muted-foreground">Chain</dt>
              <dd className="text-right text-foreground">{payment.chain}</dd>
              <dt className="text-muted-foreground">Reason</dt>
              <dd className="text-right text-foreground">{payment.reason}</dd>
            </dl>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={signing}>
              Cancel
            </Button>
            <Button onClick={confirmWithLedger} disabled={signing}>
              {signing ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <ShieldCheck data-icon="inline-start" />
              )}
              {signing ? "Waiting for device..." : "Sign & Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
