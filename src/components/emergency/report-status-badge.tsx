import type { EmergencyReport } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<EmergencyReport["status"], string> = {
  open: "bg-red-500/15 text-red-700 dark:text-red-300",
  dispatched: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  resolved: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
};

export function ReportStatusBadge({ status }: { status: EmergencyReport["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
