"use client"

import { useRouter } from "next/navigation"
import { Loader2, Wallet, Check } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useWallet, type WalletProvider } from "@/lib/wallet-context"

const providers: { id: WalletProvider; label: string; hint: string; mono: string }[] = [
  { id: "MetaMask", label: "MetaMask", hint: "Most popular browser wallet", mono: "M" },
  { id: "Coinbase", label: "Coinbase Wallet", hint: "Self-custody by Coinbase", mono: "C" },
  { id: "WalletConnect", label: "WalletConnect", hint: "Scan with a mobile wallet", mono: "W" },
]

export function WalletConnectDialog({
  open,
  onOpenChange,
  redirectTo,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}) {
  const { connect, connecting } = useWallet()
  const router = useRouter()

  async function handleConnect(provider: WalletProvider) {
    await connect(provider)
    toast.success(`Connected with ${provider}`)
    onOpenChange(false)
    if (redirectTo) router.push(redirectTo)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="size-5 text-primary" />
            Connect a wallet
          </DialogTitle>
          <DialogDescription>
            Connect your crypto wallet to fund payments and sign approvals. Your keys never
            leave your device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {providers.map((p) => {
            const isLoading = connecting === p.id
            const disabled = connecting !== null
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => handleConnect(p.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors",
                  "hover:border-primary/40 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary font-mono text-sm font-semibold text-secondary-foreground">
                  {p.mono}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.hint}</span>
                </span>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <Check className="size-4 text-transparent" />
                )}
              </button>
            )
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground text-balance">
          This is a demo. Connecting simulates a wallet session — no real transaction is signed.
        </p>
      </DialogContent>
    </Dialog>
  )
}
