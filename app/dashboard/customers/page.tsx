import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ContactsTable } from "@/components/contacts-table"
import { customers } from "@/lib/mock-data"

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Customers"
          description="Clients you invoice and collect payments from."
        />
        <ContactsTable data={customers} singular="Customer" />
      </div>
    </AppShell>
  )
}
