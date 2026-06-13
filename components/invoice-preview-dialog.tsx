"use client"

import { Download, Mail, FileText } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

export function InvoicePreviewDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            Generated Invoice Preview
          </DialogTitle>
          <DialogDescription>
            The agent drafted this invoice. Review before sending.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Invoice</p>
              <p className="text-lg font-semibold text-foreground">INV-1003</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount due</p>
              <p className="text-lg font-semibold text-foreground">$500.00</p>
            </div>
          </div>

          <Separator className="my-4" />

          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Bill to</dt>
            <dd className="text-right font-medium text-foreground">Alex Consulting</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-right text-foreground">alex@alexconsulting.com</dd>
            <dt className="text-muted-foreground">Due date</dt>
            <dd className="text-right text-foreground">Fri, Jun 19, 2026</dd>
            <dt className="text-muted-foreground">Line item</dt>
            <dd className="text-right text-foreground">Consulting services</dd>
          </dl>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Invoice PDF downloaded")}
          >
            <Download data-icon="inline-start" />
            Download PDF
          </Button>
          <Button
            onClick={() => {
              toast.success("Invoice emailed to Alex Consulting")
              onOpenChange(false)
            }}
          >
            <Mail data-icon="inline-start" />
            Send Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
