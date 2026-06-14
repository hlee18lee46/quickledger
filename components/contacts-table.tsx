"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallets } from "@privy-io/react-auth"
import { Plus, Copy, Search } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Customer, Merchant } from "@/lib/types"

type Contact = (Merchant | Customer) & {
  _id?: string
  ensName?: string
}

export function ContactsTable({
  data,
  singular,
}: {
  data: Contact[]
  singular: string
}) {
  const router = useRouter()
  const { wallets } = useWallets()
  const address = wallets[0]?.address

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [ensName, setEnsName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.ensName?.toLowerCase().includes(query.toLowerCase()),
  )

  async function handleSave() {
    if (!address) {
      toast.error("Wallet not connected")
      return
    }

    if (!name.trim()) {
      toast.error(`${singular} name is required`)
      return
    }

    try {
      setSaving(true)

      const res = await fetch(
        singular === "Merchant" ? "/api/merchants" : "/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: address,
            name,
            email,
            ensName,
            walletAddress,
            notes,
          }),
        },
      )

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || `Failed to save ${singular}`)
      }

      toast.success(`${singular} added`)

      setName("")
      setEmail("")
      setEnsName("")
      setWalletAddress("")
      setNotes("")
      setOpen(false)

      router.refresh()
    } catch (err: any) {
      toast.error(err.message || `Failed to save ${singular}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${singular.toLowerCase()}s...`}
            className="pl-9"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus data-icon="inline-start" />
                Add {singular}
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {singular}</DialogTitle>
              <DialogDescription>
                Create a new {singular.toLowerCase()} record with ENS identity and wallet details.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="ENS name, ex: sysco.eth"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
              />
              <Input
                placeholder="Fallback wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <Input
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : `Save ${singular}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>ENS Name</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id || c._id}>
                <TableCell className="font-medium text-foreground">
                  {c.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-primary">
                    {c.ensName || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.walletAddress}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {c.notes}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy wallet address"
                    onClick={() => {
                      if (c.walletAddress) {
                        navigator.clipboard?.writeText(c.walletAddress)
                        toast.success("Wallet address copied")
                      }
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No {singular.toLowerCase()}s found.
          </div>
        )}
      </Card>
    </div>
  )
}