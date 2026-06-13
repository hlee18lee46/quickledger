"use client"

import { useEffect, useState } from "react"
import { useWallets } from "@privy-io/react-auth"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"

type AgentLog = {
  _id: string
  userId: string
  walletAddress: string
  message: string
  reply: string
  createdAt: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function AgentLogGrid({ items }: { items: AgentLog[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No agent logs to show.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((log) => (
        <div
          key={log._id}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 border-b border-border pb-3">
            <p className="text-xs text-muted-foreground">
              {formatDate(log.createdAt)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Prompt
              </p>

              <div className="rounded-lg bg-muted p-3 text-sm">
                {log.message}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Agent Response
              </p>

              <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                {log.reply}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AgentLogsPage() {
  const { wallets } = useWallets()

  const [logs, setLogs] = useState<AgentLog[]>([])
  const [loading, setLoading] = useState(true)

  const address = wallets[0]?.address

  useEffect(() => {
    async function loadLogs() {
      if (!address) return

      try {
        const res = await fetch(
          `/api/agent-logs?walletAddress=${address}`,
        )

        const data = await res.json()

        setLogs(data.logs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [address])

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Agent Logs"
          description="History of prompts, agent reasoning, payment preparation, invoices, and receipts."
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading agent logs...
          </p>
        ) : (
          <AgentLogGrid items={logs} />
        )}
      </div>
    </AppShell>
  )
}