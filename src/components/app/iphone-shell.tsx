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
      <div className="relative w-[min(100%,320px)] rounded-[2.75rem] bg-gradient-to-b from-slate-800 to-slate-950 p-3 shadow-2xl ring-4 ring-slate-900/50">
        <div className="absolute left-1/2 top-5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        <div className="mt-8 overflow-hidden rounded-[2rem] bg-background ring-1 ring-white/10">
          <div className="flex items-center justify-between bg-elma-navy px-4 py-2 text-[10px] font-bold text-white">
            <span>{label}</span>
            <span>9:41</span>
          </div>
          <div className="max-h-[min(70vh,640px)] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
