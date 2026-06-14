import { Zap, Sparkles, ShieldCheck, ArrowRight } from "lucide-react"

const steps = [
  { icon: Zap, title: "Gemma & Langchain Agent", desc: "Turns natural language into actions." },
  { icon: Sparkles, title: "AI prepares the workflow", desc: "Prompts become invoices, bills & payments." },
  { icon: ShieldCheck, title: "Ledger approves payments", desc: "Outgoing transfers signed on your device." },
]

export function WorkflowStory() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="contents">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground text-pretty">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="mx-auto hidden size-4 shrink-0 text-muted-foreground md:block" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
