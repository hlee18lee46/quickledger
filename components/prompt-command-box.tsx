"use client"

import { useState } from "react"
import { Sparkles, Zap, ShieldCheck, Loader2 } from "lucide-react"
import { useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { examplePrompts } from "@/lib/mock-data"
import { InvoicePreviewDialog } from "@/components/invoice-preview-dialog"
import { signAndBroadcastEthPaymentWithLedger } from "@/lib/ledger/sign-eth-payment"

export function PromptCommandBox() {
  const [prompt, setPrompt] = useState("")
  const [running, setRunning] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  const { wallets } = useWallets()
  const ownerWallet = wallets[0]?.address

async function runAgent() {
  if (!prompt.trim()) {
    toast.error("Enter a prompt for the agent to run.")
    return
  }

  if (!ownerWallet) {
    toast.error("Connect wallet first.")
    return
  }

  try {
    setRunning(true)

    toast.loading("Agent is interpreting your request...", {
      id: "agent",
    })

    const agentRes = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        userId: ownerWallet,
        walletAddress: ownerWallet,
      }),
    })

    const agentData = await agentRes.json()

    console.log("Agent API response:", agentData)

    if (!agentRes.ok || !agentData.success) {
      throw new Error(agentData.error || "Agent failed")
    }

    const agentReply =
      typeof agentData.reply === "string"
        ? agentData.reply
        : agentData.reply?.reply || "Agent completed the task"

    const looksLikeInvoice = /invoice/i.test(prompt)
    const looksLikePayment =
  /\bpay\b|\bsend\b|\btransfer\b/i.test(prompt)

    if (looksLikeInvoice) {
      toast.success("Invoice drafted — preview ready", {
        id: "agent",
      })

      setShowInvoice(true)
      return
    }

    if (!looksLikePayment) {
      toast.success(agentReply, {
        id: "agent",
      })
      return
    }

    toast.warning("Payment prepared — checking Ledger approval...", {
      id: "agent",
    })

    const pendingRes = await fetch(
      `/api/payments/pending?userId=${encodeURIComponent(ownerWallet)}`
    )

    const pendingData = await pendingRes.json()
    const payment = pendingData.payment

    if (!payment) {
      toast.success(agentReply, {
        id: "agent",
      })
      return
    }

    const approved = window.confirm(
      `Approve with Ledger?\n\n` +
        `Recipient: ${payment.counterpartyName}\n` +
        `ENS: ${payment.ensName || payment.approvalSummary?.ensName || "N/A"}\n` +
        `Resolved Wallet: ${
          payment.toWallet || payment.approvalSummary?.resolvedWallet
        }\n` +
        `Amount: ${payment.amount} ${payment.currency}\n` +
        `Chain: ${payment.chain}\n\n` +
        `This will prompt your Ledger Nano S Plus.`
    )

    if (!approved) {
      toast.warning("Payment is still pending Ledger approval.", {
        id: "agent",
      })
      return
    }

    toast.loading("Waiting for Ledger approval...", {
      id: "agent",
    })

    const tx = await signAndBroadcastEthPaymentWithLedger({
      to: payment.toWallet,
      amountEth: String(payment.amount),
      rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
    })

    const confirmRes = await fetch("/api/payments/confirm", {
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

    const confirmData = await confirmRes.json()

    if (!confirmRes.ok || !confirmData.success) {
      throw new Error(confirmData.error || "Failed to save transaction")
    }

    toast.success(
      `Payment sent with Ledger: ${tx.txHash.slice(0, 10)}...`,
      {
        id: "agent",
      }
    )
  } catch (error: any) {
    console.error(error)

    toast.error(error.message || "Agent failed", {
      id: "agent",
    })
  } finally {
    setRunning(false)
  }
}

  return (
    <Card className="gap-0 overflow-hidden border-border p-0">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          Agent command
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          Natural language · bookkeeping & payments
        </span>
      </div>

      <div className="p-5">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: Pay ethHardware 0.02 ETH on Sepolia for hardware parts"
          className="min-h-24 resize-none border-border text-base"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {examplePrompts.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={runAgent} disabled={running} className="sm:w-auto">
            {running ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Sparkles data-icon="inline-start" />
            )}
            Run Agent
          </Button>




        </div>
      </div>

      <InvoicePreviewDialog open={showInvoice} onOpenChange={setShowInvoice} />
    </Card>
  )
}