import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ContactsTable } from "@/components/contacts-table"

async function getMerchants() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/merchants`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  return data.merchants || []
}

export default async function MerchantsPage() {
  const merchants = await getMerchants()

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Merchants"
          description="Suppliers and vendors you pay bills to."
        />

        <ContactsTable data={merchants} singular="Merchant" />
      </div>
    </AppShell>
  )
}