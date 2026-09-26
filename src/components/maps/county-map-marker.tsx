"use client";

import { cn } from "@/lib/utils";

export function CountyMapMarker({
  selected,
  hasDemoData,
  label,
  showLabel,
}: {
  selected: boolean;
  hasDemoData: boolean;
  label?: string;
  showLabel?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {showLabel && label ? (
        <div className="mb-1.5 max-w-[11rem] truncate rounded-lg bg-elma-navy/95 px-2.5 py-1.5 text-center text-[10px] font-bold text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
          {label}
        </div>
      ) : null}
      <span
        className={cn(
          "relative flex size-5 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform duration-200",
          hasDemoData ? "bg-emerald-500" : "bg-slate-400",
          selected && "scale-125 ring-4 ring-teal-400/45",
          !selected && "hover:scale-110",
        )}
      >
        {selected ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/40" aria-hidden />
        ) : null}
        <span className="relative size-2 rounded-full bg-white/90" aria-hidden />
      </span>
    </div>
  );
}
