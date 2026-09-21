import type { ShelterOperationalStatus } from "@/lib/types";
import { occupancyPercent } from "@/lib/shelter/status";
import { cn } from "@/lib/utils";

const styles: Record<
  ShelterOperationalStatus,
  { pill: string; pulse?: boolean }
> = {
  OPEN: { pill: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" },
  NEAR_CAPACITY: {
    pill: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200",
  },
  FULL: {
    pill: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
    pulse: true,
  },
  CLOSED: { pill: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

export function ShelterStatusBadge({
  occupancy,
  capacity,
  status,
}: {
  occupancy: number;
  capacity: number;
  status: ShelterOperationalStatus;
}) {
  const pct = occupancyPercent(occupancy, capacity);
  const style = styles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        style.pill,
        style.pulse && "ring-2 ring-red-500/40 ring-offset-1 ring-offset-background animate-pulse",
      )}
    >
      {pct}% occupied · {status.replace("_", " ")}
    </span>
  );
}
