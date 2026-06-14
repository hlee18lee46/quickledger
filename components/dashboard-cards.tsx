import { Bot, ShieldCheck, AtSign, ReceiptText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DashboardCards() {
  const cards = [
    {
      label: "AI Agent",
      value: "LangChain + Gemma",
      sub: "Tool-calling agent for payment workflows",
      icon: Bot,
      tone: "text-primary bg-accent",
    },
    {
      label: "Ledger Security",
      value: "Hardware approval",
      sub: "Outgoing payments are signed on your device",
      icon: ShieldCheck,
      tone: "text-primary bg-accent",
    },
    {
      label: "ENS Resolution",
      value: "Human-readable payees",
      sub: "Pay vendors using ENS names like vitalikkimchi.eth",
      icon: AtSign,
      tone: "text-primary bg-accent",
    },
    {
      label: "Receipt Automation",
      value: "PDF + email",
      sub: "Generate receipts and email vendors automatically",
      icon: ReceiptText,
      tone: "text-primary bg-accent",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.label} className="border-border">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {card.label}
                </span>

                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    card.tone
                  )}
                >
                  <Icon className="size-4" />
                </span>
              </div>

              <p className="text-xl font-semibold tracking-tight text-foreground">
                {card.value}
              </p>

              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}