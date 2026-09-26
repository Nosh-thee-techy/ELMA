"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function IphoneShell({
  children,
  className,
  label = "ELMA Field",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-[min(100%,320px)] rounded-[2.75rem] bg-gradient-to-b from-slate-700 via-slate-900 to-black p-[3px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <div className="rounded-[2.65rem] bg-gradient-to-b from-slate-800 to-slate-950 p-3">
          <div
            className="absolute left-1/2 top-5 z-20 h-6 w-[5.5rem] -translate-x-1/2 rounded-full bg-black shadow-inner ring-1 ring-white/5"
            aria-hidden
          />
          <div className="mt-8 overflow-hidden rounded-[2rem] bg-background shadow-inner ring-1 ring-white/10">
            <div className="flex items-center justify-between bg-gradient-to-r from-elma-navy to-slate-900 px-4 py-2.5 text-[10px] font-bold tracking-wide text-white">
              <span>{label}</span>
              <span className="text-white/60">9:41</span>
            </div>
            <div className="max-h-[min(70vh,640px)] overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
