"use client"

import { useState } from "react"
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  ExternalLink,
} from "lucide-react"
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
import { signAndBroadcastEthPaymentWithLedger } from "@/lib/ledger/sign-eth-payment"

function shortHash(hash?: string) {
  if (!hash) return ""
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

function getExplorerUrl(txHash?: string, chain?: string) {
  if (!txHash) return ""

  const normalizedChain = chain?.toLowerCase()

  if (
    normalizedChain === "ethereum" ||
    normalizedChain === "eth" ||
    normalizedChain === "sepolia"
  ) {
    return `https://sepolia.etherscan.io/tx/${txHash}`
  }

  return `https://sepolia.etherscan.io/tx/${txHash}`
}

export function PaymentApprovalCard({ payment }: { payment: any }) {
  const [status, setStatus] = useState(payment.status)
  const [approved, setApproved] = useState(payment.ledgerApproved)
  const [txHash, setTxHash] = useState(payment.txHash || "")
  const [fromWallet, setFromWallet] = useState(payment.fromWallet || "")
  const [open, setOpen] = useState(false)
  const [signing, setSigning] = useState(false)

  const Icon = payment.type === "outgoing" ? ArrowUpRight : ArrowDownLeft

  const counterparty = payment.counterpartyName || payment.counterparty
  const ensName = payment.ensName
  const toWallet = payment.toWallet || payment.walletAddress
  const reason = payment.reason || payment.description || ""
  const currency = payment.currency || "ETH"
  const explorerUrl = getExplorerUrl(txHash, payment.chain)

  async function copyTxHash() {
    if (!txHash) return

    await navigator.clipboard.writeText(txHash)
    toast.success("Transaction hash copied")
  }

  async function confirmWithLedger() {
    try {
      if (!toWallet) {
        toast.error("Missing recipient wallet address")
        return
      }

      setSigning(true)
      toast.loading("Waiting for Ledger approval...", { id: "ledger" })

      const tx = await signAndBroadcastEthPaymentWithLedger({
        to: toWallet,
        amountEth: String(payment.amount),
        rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
      })

      const res = await fetch("/api/payments/confirm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: payment._id,
          txHash: tx.txHash,
          fromWallet: tx.from,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save confirmed payment")
      }

      setApproved(true)
      setStatus("completed")
      setTxHash(tx.txHash)
      setFromWallet(tx.from)
      setOpen(false)

      toast.success(`Payment sent: ${shortHash(tx.txHash)}`, {
        id: "ledger",
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Ledger approval failed", {
        id: "ledger",
      })
    } finally {
      setSigning(false)
    }
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
              <CardTitle className="text-base">{counterparty}</CardTitle>
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
            {payment.amount} {currency}
          </span>
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground">{reason}</p>

        {ensName && (
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">ENS</p>
            <p className="font-mono text-xs text-foreground">{ensName}</p>
          </div>
        )}

        {toWallet && (
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">To Wallet</p>
            <p className="break-all font-mono text-xs text-muted-foreground">
              {toWallet}
            </p>
          </div>
        )}

        {fromWallet && (
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">From Wallet</p>
            <p className="break-all font-mono text-xs text-muted-foreground">
              {fromWallet}
            </p>
          </div>
        )}

        {txHash && (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-xs text-muted-foreground">Transaction ID</p>

            <button
              type="button"
              onClick={copyTxHash}
              className="mt-1 break-all text-left font-mono text-xs text-foreground hover:underline"
            >
              {shortHash(txHash)}
            </button>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              View on Etherscan
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}

        {payment.type === "outgoing" &&
        status === "pending_ledger_approval" ? (
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
              Verify the transaction details on your Nano S Plus before signing.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Recipient</dt>
              <dd className="text-right font-medium text-foreground">
                {counterparty}
              </dd>

              {ensName && (
                <>
                  <dt className="text-muted-foreground">ENS</dt>
                  <dd className="text-right font-mono text-xs text-foreground">
                    {ensName}
                  </dd>
                </>
              )}

              <dt className="text-muted-foreground">Wallet</dt>
              <dd className="break-all text-right font-mono text-xs text-foreground">
                {toWallet}
              </dd>

              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-right font-medium text-foreground">
                {payment.amount} {currency}
              </dd>

              <dt className="text-muted-foreground">Chain</dt>
              <dd className="text-right text-foreground">{payment.chain}</dd>

              <dt className="text-muted-foreground">Reason</dt>
              <dd className="text-right text-foreground">{reason}</dd>
            </dl>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={signing}
            >
              Cancel
            </Button>

            <Button onClick={confirmWithLedger} disabled={signing}>
              {signing ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <ShieldCheck data-icon="inline-start" />
              )}
              {signing ? "Waiting for device..." : "Sign & Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}