"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Users,
  FileText,
  ReceiptText,
  ArrowLeftRight,
  ScrollText,
  Settings,
  Menu,
  X,
  Wallet,
  LogOut,
  Copy,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/merchants", label: "Merchants", icon: Store },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/bills", label: "Bills", icon: ReceiptText },
  { href: "/dashboard/payments", label: "Payments", icon: ArrowLeftRight },
  { href: "/dashboard/receipts", label: "Receipts", icon: ScrollText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function shortenAddress(address?: string) {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-4" />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        QuickLedgerBooks
      </span>
    </Link>
  )
}

function WalletMenu() {
  const router = useRouter()
  const { logout } = usePrivy()
  const { wallets } = useWallets()

  const wallet = wallets[0]
  const address = wallet?.address
  const provider = wallet?.walletClientType || "Privy Embedded Wallet"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="gap-2">
            <span className="size-2 rounded-full bg-success" />
            <span className="font-mono text-xs">{shortenAddress(address)}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{provider}</span>
            <span className="font-mono text-xs text-foreground">
              {shortenAddress(address)}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              if (address) navigator.clipboard?.writeText(address)
              toast.success("Address copied")
            }}
          >
            <Copy className="size-4" />
            Copy address
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await logout()
              toast.success("Wallet disconnected")
              router.push("/")
            }}
          >
            <LogOut className="size-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <Brand />
        <NavLinks />
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-medium text-foreground">Agent ready</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Blink funds the wallet · AI prepares the books · Ledger approves
              payments.
            </p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-sidebar">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <span className="text-sm font-semibold text-foreground lg:hidden">
            QuickLedgerBooks
          </span>

          <div className="ml-auto flex items-center gap-2">
            <WalletMenu />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export function WalletGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { ready, authenticated } = usePrivy()

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/")
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <Wallet className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Connect your wallet to access the dashboard. Redirecting…
        </p>
      </div>
    )
  }

  return <>{children}</>
}