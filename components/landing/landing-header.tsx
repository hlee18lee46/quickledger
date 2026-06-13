"use client"

import Link from "next/link"
import { Wallet } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
]

function shortenAddress(address?: string) {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function LandingHeader() {
  const { ready, authenticated, login } = usePrivy()
  const { wallets } = useWallets()

  const connected = ready && authenticated
  const address = wallets[0]?.address

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>

          <span className="text-base font-semibold tracking-tight text-foreground">
            QuickLedgerBooks
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {connected ? (
            <Button
              nativeButton={false}
              render={
                <Link href="/dashboard">
                  <span className="size-2 rounded-full bg-success" />
                  <span className="font-mono text-xs">
                    {shortenAddress(address)}
                  </span>
                </Link>
              }
            />
          ) : (
            <Button onClick={login} disabled={!ready}>
              <Wallet data-icon="inline-start" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}