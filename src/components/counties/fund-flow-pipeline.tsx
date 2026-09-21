import { cn } from "@/lib/utils";
import { ArrowRight, FileSpreadsheet, Hammer, Wallet } from "lucide-react";

const steps = [
  {
    id: "releases",
    label: "Releases",
    description: "What national & county treasuries published",
    icon: Wallet,
  },
  {
    id: "spending",
    label: "Spending",
    description: "Cash out the door to programmes & contractors",
    icon: FileSpreadsheet,
  },
  {
    id: "tenders",
    label: "Tenders",
    description: "Contracts, progress & field verification",
    icon: Hammer,
  },
] as const;

export function FundFlowPipeline({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-white p-4 shadow-sm sm:p-6",
        className,
      )}
      aria-label="How public money flows"
    >
      {!compact ? (
        <p className="mb-4 text-sm font-bold text-elma-navy">How to read ELMA</p>
      ) : null}
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:flex-col sm:text-center">
            <div className="flex flex-1 flex-col items-center gap-2 sm:w-full">
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <step.icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-extrabold text-elma-navy">{step.label}</p>
                {!compact ? (
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </div>
            {index < steps.length - 1 ? (
              <ArrowRight
                className="hidden size-5 shrink-0 text-teal-600/60 sm:mx-1 sm:block"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
