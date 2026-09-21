import { cn } from "@/lib/utils";

export function CountyDataBadge({ fullData }: { fullData: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        fullData ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600",
      )}
    >
      {fullData ? "Full data" : "Coming soon"}
    </span>
  );
}
