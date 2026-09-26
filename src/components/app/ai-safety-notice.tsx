import type { GuidanceConfidence } from "@/lib/ai/citizen-safety";
import { ELMA_AI_DISCLAIMER } from "@/lib/ai/citizen-safety";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export function AiSafetyNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] leading-relaxed text-amber-950 dark:text-amber-100",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <p>{ELMA_AI_DISCLAIMER}</p>
    </div>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: GuidanceConfidence }) {
  if (confidence === "verified_static") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-200">
        <ShieldAlert className="size-3" aria-hidden />
        Curated
      </span>
    );
  }
  if (confidence === "needs_official") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-800 dark:text-red-200">
        <AlertTriangle className="size-3" aria-hidden />
        Confirm locally
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-800 dark:text-violet-200">
      General AI
    </span>
  );
}
