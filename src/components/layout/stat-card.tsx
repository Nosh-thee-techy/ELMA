import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "clay" | "alert";
};

const toneStyles = {
  default: "bg-white",
  clay: "bg-[#fff4e6]",
  alert: "bg-[#ffeef0]",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className={cn("elma-card flex flex-col gap-2 p-5 sm:p-6", toneStyles[tone])}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon ? <Icon className="size-5 text-primary" aria-hidden /> : null}
      </div>
      <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{value}</p>
      {hint ? <p className="text-sm font-medium text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
