"use client"

import Link from "next/link"
import Image from "next/image"
import { Wallet, ArrowRight, ShieldCheck } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"

export function Hero() {
  const { login, authenticated, ready } = usePrivy()

  const connected = ready && authenticated

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          Blink-funded · AI-prepared · Ledger-approved
        </span>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
          Bookkeeping and crypto payments, run by a single prompt
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          QuickLedgerBooks turns plain-English requests into invoices, bills,
          and on-chain payments. Connect your wallet, type what you need, and
          approve with Ledger.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {connected ? (
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight data-icon="inline-end" />
                </Link>
              }
            />
          ) : (
            <Button size="lg" onClick={login} disabled={!ready}>
              <Wallet data-icon="inline-start" />
              Connect Wallet
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="#how">See how it works</a>}
          />
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Non-custodial. Your keys stay in your wallet.
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image
            src="/dashboard-preview.png"
            alt="QuickLedgerBooks dashboard showing wallet balance, KPI cards, and an AI prompt box"
            width={1600}
            height={1000}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </section>
  )
}