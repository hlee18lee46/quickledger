import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const styles: Record<string, string> = {
  // green / success
  paid: "bg-success/15 text-success border-success/20",
  completed: "bg-success/15 text-success border-success/20",
  approved: "bg-success/15 text-success border-success/20",
  // amber / warning
  unpaid: "bg-warning/15 text-warning-foreground border-warning/30",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  awaiting_approval: "bg-warning/15 text-warning-foreground border-warning/30",
  scheduled: "bg-accent text-accent-foreground border-accent-foreground/15",
  // red / destructive
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  // neutral
  draft: "bg-muted text-muted-foreground border-border",
}

const labels: Record<string, string> = {
  awaiting_approval: "Awaiting Ledger",
}

export function StatusBadge({ status }: { status: string }) {
  const label = labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", styles[status])}>
      {label}
    </Badge>
  )
}
