"use client"

import { Zap, ShieldCheck, Database, Mail, FileText, Bot } from "lucide-react"
import { toast } from "sonner"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const integrations = [
  {
    name: "Blink Deposit SDK",
    desc: "Fund your business wallet with crypto deposits.",
    icon: Zap,
    connected: true,
  },
  {
    name: "Ledger",
    desc: "Hardware approval for all outgoing payments.",
    icon: ShieldCheck,
    connected: true,
  },
  {
    name: "MongoDB",
    desc: "Persist merchants, customers, invoices and bills.",
    icon: Database,
    connected: false,
  },
  {
    name: "LangChain Agent",
    desc: "Tool-calling agent that runs your prompts.",
    icon: Bot,
    connected: false,
  },
  {
    name: "PDF Generation",
    desc: "Generate invoice and receipt PDFs.",
    icon: FileText,
    connected: false,
  },
  {
    name: "Email Sender",
    desc: "Deliver invoices and receipts to customers.",
    icon: Mail,
    connected: false,
  },
]

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PageHeader
          title="Settings"
          description="Manage your business profile and connected services."
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business profile</CardTitle>
            <CardDescription>Used on invoices and receipts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Business name</label>
                <Input defaultValue="QuickLedger Demo Co." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Contact email</label>
                <Input defaultValue="hello@quickledger.app" type="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Wallet address</label>
                <Input defaultValue="0x7a3F...9c21" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Default chain</label>
                <Input defaultValue="Ethereum" />
              </div>
            </div>
            <div>
              <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integrations</CardTitle>
            <CardDescription>
              Connect services to power the agent workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {integrations.map((int, idx) => {
              const Icon = int.icon
              return (
                <div key={int.name}>
                  <div className="flex items-center gap-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{int.name}</p>
                        {int.connected && (
                          <Badge
                            variant="outline"
                            className="border-success/20 bg-success/15 text-success"
                          >
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{int.desc}</p>
                    </div>
                    <Button
                      variant={int.connected ? "outline" : "default"}
                      size="sm"
                      onClick={() =>
                        toast.success(
                          int.connected ? `${int.name} disconnected` : `${int.name} connected`,
                        )
                      }
                    >
                      {int.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  {idx < integrations.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
