import { cn } from "@/lib/utils";

export function KenyaCountyMapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[min(520px,50vh)] min-h-[320px] w-full animate-pulse flex-col items-center justify-center rounded-2xl border border-white/15 bg-slate-900/60 text-sm font-semibold text-white/60 lg:h-[520px]",
        className,
      )}
      aria-busy
      aria-label="Loading Kenya county map"
    >
      Loading county map…
    </div>
  );
}
