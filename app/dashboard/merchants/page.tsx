import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ContactsTable } from "@/components/contacts-table"
import { merchants } from "@/lib/mock-data"

export default function MerchantsPage() {
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
