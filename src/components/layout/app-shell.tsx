"use client";

import { LogoutButton } from "@/components/layout/logout-button";
import { PageTopBar } from "@/components/layout/page-top-bar";
import { SiteNav } from "@/components/layout/site-nav";
import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { buttonVariants } from "@/components/ui/button-variants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { portalNavLinks, publicNavLinks, type NavGroup } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { Menu, WifiOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export function AppShell({
  children,
  signedIn,
}: {
  children: React.ReactNode;
  signedIn: boolean;
}) {
  const { lowBandwidth, toggle } = useLowBandwidth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        id: "main",
        title: "Menu",
        subtitle: "",
        items: signedIn ? portalNavLinks : publicNavLinks,
      },
    ],
    [signedIn],
  );

  const hidePageTitle =
    pathname === "/" || pathname === "/login" || pathname.startsWith("/counties/");
  const isMarketing = !signedIn && (pathname === "/" || pathname === "/about");

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
              {!signedIn ? (
                <Link
                  href="/login?next=/counties"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full bg-white px-3 text-xs font-bold text-elma-sidebar",
                  )}
                >
                  Sign in
                </Link>
              ) : null}
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
                    <SiteNav
                      dark
                      orientation="vertical"
                      groups={navGroups}
                      onNavigate={() => setMenuOpen(false)}
                    />
                    {signedIn ? (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <LogoutButton dark />
                      </div>
                    ) : null}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <SiteNav dark orientation="horizontal" groups={navGroups} className="hidden lg:flex" />

          <div className="hidden items-center gap-2 lg:flex lg:shrink-0">
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
            {signedIn ? (
              <>
                <Link
                  href="/counties"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "h-10 rounded-full bg-white font-bold text-elma-sidebar hover:bg-white/90",
                  )}
                >
                  Counties
                </Link>
                <LogoutButton dark />
              </>
            ) : (
              <Link
                href="/login?next=/counties"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "h-10 rounded-full border-white/30 bg-white/10 font-bold text-white hover:bg-white/20",
                )}
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        <div
          className={cn(
            "elma-dashboard-panel flex flex-1 flex-col gap-6 rounded-[1.75rem] p-4 sm:p-6 lg:p-8",
            isMarketing ? "bg-transparent" : "bg-elma-canvas/80",
          )}
        >
          {!hidePageTitle ? <PageTopBar showSearch={false} /> : null}
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
