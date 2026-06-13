import { AppShell } from "@/components/app-shell"
import { PromptCommandBox } from "@/components/prompt-command-box"
import { DashboardCards } from "@/components/dashboard-cards"
import { RecentActivity } from "@/components/recent-activity"
import { WorkflowStory } from "@/components/workflow-story"
import { PaymentApprovalCard } from "@/components/payment-approval-card"

async function getPayments() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments`,
      {
        cache: "no-store",
      }
    )

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.payments || []
  } catch (error) {
    console.error("Failed to load payments:", error)
    return []
  }
}

export default async function DashboardPage() {
  const payments = await getPayments()

  const pending = payments.filter(
    (p: any) => p.status === "pending_ledger_approval"
  )

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
              pending.map((payment: any) => (
                <PaymentApprovalCard
                  key={payment._id}
                  payment={payment}
                />
              ))
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