"use client";

import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

export function PhoneExtraTabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="More">
        {tabs.map((tab) => {
          const selected = open === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setOpen(selected ? null : tab.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold",
                selected ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-muted text-muted-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={open !== tab.id}
          className="max-h-36 overflow-y-auto overscroll-contain rounded-xl border border-border/80 bg-muted/30 p-2.5"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
