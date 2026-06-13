"use client"

import { useState } from "react"
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

type Contact = Merchant | Customer

export function ContactsTable({
  data,
  singular,
}: {
  data: Contact[]
  singular: string
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()),
  )

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
                Create a new {singular.toLowerCase()} record. Wired to your backend later.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Input placeholder="Name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Wallet address (0x...)" />
              <Input placeholder="Notes" />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setOpen(false)
                  toast.success(`${singular} added`)
                }}
              >
                Save {singular}
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
              <TableHead>Wallet</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id || c._id}>
                <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
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
                    onClick={() => toast.success("Wallet address copied")}
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
