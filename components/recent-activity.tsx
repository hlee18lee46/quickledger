import { CheckCircle2, Clock, ShieldAlert, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { agentActions } from "@/lib/mock-data"
import type { AgentStatus } from "@/lib/types"

const statusIcon: Record<AgentStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  pending: Clock,
  awaiting_approval: ShieldAlert,
  failed: XCircle,
}

export function RecentActivity() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">What QuickLedgerBooks does</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {agentActions.map((action) => {
          const Icon = statusIcon[action.status]
          return (
            <div
              key={action.id}
              className="flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {action.prompt}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {action.intent}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{action.createdAt}</span>
                </div>
              </div>
              <StatusBadge status={action.status} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
