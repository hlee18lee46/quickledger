import { AppShell } from "@/components/app-shell"
import { PromptCommandBox } from "@/components/prompt-command-box"
import { DashboardCards } from "@/components/dashboard-cards"
import { RecentActivity } from "@/components/recent-activity"
import { WorkflowStory } from "@/components/workflow-story"
import { PaymentApprovalCard } from "@/components/payment-approval-card"
import { payments } from "@/lib/mock-data"

export default function DashboardPage() {
  const pending = payments.filter((p) => p.type === "outgoing" && p.status === "pending")

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Run your bookkeeping and payments with a single prompt.
          </p>
        </div>

        <PromptCommandBox />
        <WorkflowStory />
        <DashboardCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Pending Ledger approvals
            </h2>
            {pending.length > 0 ? (
              pending.map((p) => <PaymentApprovalCard key={p.id} payment={p} />)
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No payments awaiting approval.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
