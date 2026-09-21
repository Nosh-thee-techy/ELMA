import { cn } from "@/lib/utils";
import { ArrowRight, FileSpreadsheet, Hammer, MapPinned, Wallet } from "lucide-react";

const steps = [
  {
    id: "allocation",
    label: "Allocation",
    description: "Budget voted & published for county / ward",
    icon: Wallet,
  },
  {
    id: "disbursal",
    label: "Disbursal",
    description: "Treasury release to county accounts",
    icon: FileSpreadsheet,
  },
  {
    id: "procurement",
    label: "Ward procurement",
    description: "Tenders awarded to contractors",
    icon: Hammer,
  },
  {
    id: "verified",
    label: "Verified on-ground",
    description: "Photos, receipts & gazette citations",
    icon: MapPinned,
  },
] as const;

export function FundFlowPipeline({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6",
        className,
      )}
      aria-label="Public money flow"
    >
      {!compact ? (
        <p className="mb-4 text-sm font-bold text-elma-navy dark:text-slate-100">
          Allocation → disbursal → procurement → verified work
        </p>
      ) : null}
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.id} className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
                <step.icon className="size-4" aria-hidden />
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight className="hidden size-4 text-muted-foreground lg:block" aria-hidden />
              ) : null}
            </div>
            <p className="font-extrabold text-elma-navy dark:text-slate-50">{step.label}</p>
            {!compact ? (
              <p className="text-xs leading-snug text-muted-foreground">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
