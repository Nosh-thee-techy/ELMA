"use client";

import { cn } from "@/lib/utils";
import { ClipboardCheck, LifeBuoy, Siren } from "lucide-react";
import type { ReactNode } from "react";

export type CitizenTab = "sos" | "now" | "ready";

const tabs: { id: CitizenTab; label: string; icon: typeof Siren }[] = [
  { id: "sos", label: "SOS", icon: Siren },
  { id: "now", label: "Now", icon: LifeBuoy },
  { id: "ready", label: "Ready", icon: ClipboardCheck },
];

export function CitizenPhoneShell({
  activeTab,
  onTabChange,
  children,
  topBar,
}: {
  activeTab: CitizenTab;
  onTabChange: (tab: CitizenTab) => void;
  children: ReactNode;
  topBar?: ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 md:min-h-0 md:items-center md:justify-center md:py-8">
      <div className="flex w-full flex-1 flex-col md:max-w-[360px] md:flex-none">
        <div className="relative flex flex-1 flex-col md:rounded-[2.75rem] md:bg-gradient-to-b md:from-slate-700 md:via-slate-900 md:to-black md:p-[3px] md:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.55)] md:ring-1 md:ring-white/10">
          <div className="flex flex-1 flex-col md:rounded-[2.65rem] md:bg-gradient-to-b md:from-slate-800 md:to-slate-950 md:p-3">
            <div
              className="pointer-events-none absolute left-1/2 top-5 z-20 hidden h-6 w-[5.5rem] -translate-x-1/2 rounded-full bg-black shadow-inner ring-1 ring-white/5 md:block"
              aria-hidden
            />
            <div className="mt-0 flex flex-1 flex-col overflow-hidden bg-background md:mt-8 md:rounded-[2rem] md:shadow-inner md:ring-1 md:ring-white/10">
              <div className="flex items-center justify-between bg-gradient-to-r from-elma-navy to-slate-900 px-4 py-2.5 text-[10px] font-bold tracking-wide text-white">
                {topBar ?? (
                  <>
                    <span>ELMA Pocket</span>
                    <span className="text-white/60">SOS · Now · Ready</span>
                  </>
                )}
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain pb-2">{children}</div>
              <nav
                className="sticky bottom-0 z-10 border-t border-border/80 bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md"
                aria-label="Citizen app"
              >
                <ul className="grid grid-cols-3 gap-1 px-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <li key={tab.id}>
                        <button
                          type="button"
                          onClick={() => onTabChange(tab.id)}
                          className={cn(
                            "flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-bold transition-colors",
                            active
                              ? tab.id === "sos"
                                ? "bg-red-500/15 text-red-700 dark:text-red-300"
                                : "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/80",
                          )}
                        >
                          <Icon className="size-5" aria-hidden />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
