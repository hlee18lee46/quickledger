"use client"

import Link from "next/link"
import { Wallet, ArrowRight, CornerDownLeft } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"

const promptFlow = [
  { role: "you", text: "Pay Sami Hardware Labs 0.01 ETH for the sensor order" },
  { role: "agent", text: "Drafted payment · 0.01 ETH on Ethereum to Sami Hardware Labs." },
  { role: "agent", text: "Logged matching bill and prepared a receipt." },
  { role: "ledger", text: "Awaiting Ledger approval before broadcasting." },
]

export function WorkflowShowcase() {
  return (
    <section id="workflow" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Describe it once. The agent handles the rest.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            Outgoing payments never move without an explicit Ledger approval,
            so the convenience of an AI agent never costs you control over your
            funds.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3">
            {promptFlow.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "you"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : m.role === "ledger"
                      ? "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-foreground"
                      : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-muted px-4 py-2.5 text-sm text-foreground"
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <span className="flex-1 truncate text-sm text-muted-foreground">
              Ask QuickLedgerBooks to do something…
            </span>
            <CornerDownLeft className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  const { login, authenticated, ready } = usePrivy()
  const connected = ready && authenticated

  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Run your books at the speed of a sentence
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
            Connect a wallet to start drafting invoices and approving payments
            in minutes.
          </p>

          {connected ? (
            <Button
              size="lg"
              variant="secondary"
              nativeButton={false}
              render={
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight data-icon="inline-end" />
                </Link>
              }
            />
          ) : (
            <Button
              size="lg"
              variant="secondary"
              onClick={login}
              disabled={!ready}
            >
              <Wallet data-icon="inline-start" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-3.5" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            QuickLedgerBooks
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Demo product · Privy-wallet, Blink-funded, AI-prepared,
          Ledger-approved.
        </p>
      </div>
    </footer>
  )
}