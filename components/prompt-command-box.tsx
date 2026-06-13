"use client"

import { useState } from "react"
import { Sparkles, Zap, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { examplePrompts } from "@/lib/mock-data"
import { InvoicePreviewDialog } from "@/components/invoice-preview-dialog"

export function PromptCommandBox() {
  const [prompt, setPrompt] = useState("")
  const [running, setRunning] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  function runAgent() {
    if (!prompt.trim()) {
      toast.error("Enter a prompt for the agent to run.")
      return
    }
    setRunning(true)
    toast.loading("Agent is interpreting your request...", { id: "agent" })
    setTimeout(() => {
      setRunning(false)
      const looksLikeInvoice = /invoice/i.test(prompt)
      const looksLikePayment = /pay|send|eth|transfer/i.test(prompt)
      if (looksLikeInvoice) {
        toast.success("Invoice drafted — preview ready", { id: "agent" })
        setShowInvoice(true)
      } else if (looksLikePayment) {
        toast.warning("Payment prepared — awaiting Ledger approval", { id: "agent" })
      } else {
        toast.success("Agent completed the task", { id: "agent" })
      }
    }, 1400)
  }

  return (
    <Card className="gap-0 overflow-hidden border-border p-0">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Agent command</span>
        <span className="ml-auto text-xs text-muted-foreground">
          Natural language · bookkeeping & payments
        </span>
      </div>

      <div className="p-5">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: Create invoice for Alex for $500 due next Friday and email it"
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
          <Button
            variant="outline"
            onClick={() => toast.success("Blink deposit initiated — wallet will be funded shortly")}
          >
            <Zap data-icon="inline-start" />
            Fund with Blink
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Ledger device connected")}
          >
            <ShieldCheck data-icon="inline-start" />
            Connect Ledger
          </Button>
        </div>
      </div>

      <InvoicePreviewDialog open={showInvoice} onOpenChange={setShowInvoice} />
    </Card>
  )
}
