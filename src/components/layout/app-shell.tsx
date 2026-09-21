"use client";

import { PageTopBar } from "@/components/layout/page-top-bar";
import { SiteNav } from "@/components/layout/site-nav";
import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Search, WifiOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { lowBandwidth, toggle } = useLowBandwidth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-elma-canvas p-3 sm:p-4 lg:p-5">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:gap-5">
        <header className="elma-sidebar sticky top-3 z-40 flex flex-col gap-3 rounded-[1.75rem] px-3 py-3 shadow-lg sm:px-4 lg:top-5 lg:flex-row lg:items-center lg:gap-4 lg:py-2.5">
          <div className="flex items-center justify-between gap-3 lg:shrink-0">
            <Link href="/" className="flex flex-col px-2 text-white">
              <span className="text-lg font-extrabold tracking-[0.25em] sm:text-xl">ELMA</span>
              <span className="hidden text-[10px] font-semibold text-white/60 sm:block">
                Monitoring & Accountability
              </span>
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className={cn(
                  "min-h-10 min-w-10 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20",
                  lowBandwidth && "border-white bg-white text-elma-sidebar",
                )}
                onClick={toggle}
                aria-pressed={lowBandwidth}
                aria-label="Toggle lite mode"
              >
                <WifiOff />
              </Button>
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-lg"
                      className="min-h-10 min-w-10 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20"
                      aria-label="Open menu"
                    />
                  }
                >
                  <Menu />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="elma-sidebar flex w-[min(100vw-2rem,20rem)] flex-col gap-0 rounded-l-[1.75rem] border-0 p-0 text-white"
                >
                  <SheetHeader className="border-b border-white/10 p-5 text-left">
                    <SheetTitle className="font-extrabold tracking-widest text-white">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <SiteNav dark orientation="vertical" onNavigate={() => setMenuOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <SiteNav dark orientation="horizontal" className="hidden lg:flex" />

          <div className="hidden items-center gap-2 lg:flex lg:shrink-0">
            <div className="relative w-44 xl:w-52">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search…"
                className="h-10 rounded-full border-0 bg-white/15 pl-9 text-sm text-white placeholder:text-white/50 focus-visible:bg-white/20 focus-visible:ring-white/30"
                aria-label="Search"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 rounded-full border-white/25 bg-white/10 px-4 font-semibold text-white hover:bg-white/20",
                lowBandwidth && "border-white bg-white text-elma-sidebar",
              )}
              onClick={toggle}
              aria-pressed={lowBandwidth}
            >
              <WifiOff data-icon="inline-start" />
              Lite
            </Button>
          </div>
        </header>

        <div className="elma-dashboard-panel flex flex-1 flex-col gap-6 rounded-[1.75rem] bg-elma-canvas/80 p-4 sm:p-6 lg:p-8">
          <PageTopBar showSearch={false} />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
