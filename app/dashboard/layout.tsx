import { WalletGuard } from "@/components/app-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WalletGuard>{children}</WalletGuard>
}
