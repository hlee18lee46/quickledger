"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { PaymentApprovalCard } from "@/components/payment-approval-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Payment } from "@/lib/types"

function PaymentGrid({ items }: { items: Payment[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No payments to show.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => (
        <PaymentApprovalCard key={p.id} payment={p} />
      ))}
    </div>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch("/api/payments")
        if (!res.ok) {
          throw new Error("Failed to load payments")
        }

const data = await res.json()

const mapped: Payment[] = data.payments.map((p: any) => ({
  ...p,
  id: p._id,
}))

        setPayments(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  const incoming = payments.filter((p) => p.type === "incoming")
  const outgoing = payments.filter((p) => p.type === "outgoing")

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Payments"
          description="Crypto payments in and out of your wallet. Outgoing transfers require Ledger approval."
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading payments...</p>
        ) : (
          <Tabs defaultValue="all" className="gap-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              <TabsTrigger value="incoming">Incoming</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <PaymentGrid items={payments} />
            </TabsContent>

            <TabsContent value="outgoing">
              <PaymentGrid items={outgoing} />
            </TabsContent>

            <TabsContent value="incoming">
              <PaymentGrid items={incoming} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  )
}