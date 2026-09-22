import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getServerSession } from "@/lib/auth/session";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = getServerSession();
  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
