import {
  Wallet,
  Sparkles,
  ShieldCheck,
  FileText,
  ReceiptText,
  ArrowLeftRight,
  ScrollText,
  Mail,
  Bot,
} from "lucide-react"

const steps = [
  {
    icon: Wallet,
    name: "Blink funds the wallet",
    desc: "Top up your business wallet with crypto. Balances sync instantly so the agent always knows what it can spend.",
  },
  {
    icon: Bot,
    name: "AI prepares the books",
    desc: "Type a request in plain English. The agent drafts invoices, logs bills, and reconciles your ledger automatically.",
  },
  {
    icon: ShieldCheck,
    name: "Ledger approves payments",
    desc: "Every outgoing payment waits for an explicit Ledger approval before it ever touches the chain.",
  },
]

const features = [
  { icon: FileText, name: "Smart invoices", desc: "Generate and email branded invoices from a single prompt." },
  { icon: ReceiptText, name: "Bill tracking", desc: "Capture vendor bills and schedule payments before they're due." },
  { icon: ArrowLeftRight, name: "On-chain payments", desc: "Pay across Ethereum, Base, and Polygon with live status." },
  { icon: ScrollText, name: "Auto receipts", desc: "Receipts are generated and stored the moment a payment settles." },
  { icon: Sparkles, name: "Prompt-first UX", desc: "No menus to hunt through — just describe the outcome you want." },
  { icon: Mail, name: "Email delivery", desc: "Send invoices and receipts to customers without leaving the app." },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Three steps, one workflow
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            QuickLedgerBooks keeps funding, automation, and approvals cleanly separated so you
            stay in control of every dollar.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.name}
                className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="absolute right-6 top-6 font-mono text-sm text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{step.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Everything your books need
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            A complete back office for small businesses that run on crypto.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.name}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{f.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
