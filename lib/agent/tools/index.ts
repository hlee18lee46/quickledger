export type ToolContext = {
  userId: string
  walletAddress?: string
}

import { createMerchantTools } from "./merchant-tools"
import { createCustomerTools } from "./customer-tools"
import { createInvoiceTools } from "./invoice-tools"
import { createBillTools } from "./bill-tools"
import { createPaymentTools } from "./payment-tools"
import { createDashboardTools } from "./dashboard-tools"
import { createENSTools } from "./ens-tools"

export function createQuickLedgerTools(context: ToolContext) {
  return [
    ...createMerchantTools(context),
    ...createCustomerTools(context),
    ...createInvoiceTools(context),
    ...createBillTools(context),
    ...createPaymentTools(context),
    ...createDashboardTools(context),
    ...createENSTools(context),
  ]
}