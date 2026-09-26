"use client";

import { ElmaLogo } from "@/components/brand/elma-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { PageTopBar } from "@/components/layout/page-top-bar";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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
import type { SessionProfile } from "@/lib/auth/session";
import { resolvePublicNavGroups, roleNavLabel } from "@/lib/content/nav-by-role";
import { citizenAppNavLink } from "@/lib/content/site";
import type { NavGroup } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { Menu, WifiOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export function AppShell({
  children,
  sessionActive,
  profile,
}: {
  children: React.ReactNode;
  sessionActive: boolean;
  profile: SessionProfile | null;
}) {
  const { lowBandwidth, toggle } = useLowBandwidth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isStaff =
    sessionActive &&
    profile &&
    (profile.role === "RESPONDER" || profile.role === "ADMIN" || profile.role === "VERIFIER");

  const navGroups: NavGroup[] = useMemo(() => resolvePublicNavGroups(), []);

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/responder/login") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/app")
  ) {
    return <>{children}</>;
  }

  const hidePageTitle =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname === "/app" ||
    pathname === "/policy" ||
    pathname === "/transparency" ||
    pathname === "/shelters" ||
    pathname.startsWith("/channels") ||
    pathname.startsWith("/counties/");
  const isMarketing =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname === "/app" ||
    pathname === "/policy" ||
    pathname.startsWith("/channels");

  return (
    <div className="elma-page-bg min-h-screen p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-5 lg:gap-6">
        <header className="elma-header sticky top-3 z-40 flex flex-col gap-3 rounded-2xl px-3 py-3 sm:px-4 lg:top-6 lg:flex-row lg:items-center lg:gap-4 lg:py-2.5">
          <div className="flex items-center justify-between gap-3 lg:shrink-0">
            <Link href="/" className="px-1">
              <ElmaLogo variant="light" />
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href={citizenAppNavLink.href}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-10 rounded-full bg-red-500/90 px-3 text-xs font-bold text-white hover:bg-red-400",
                )}
              >
                SOS
              </Link>
              {!isStaff ? (
                <Link
                  href="/responder/login"
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" }),
                    "h-10 rounded-full border-white/25 bg-white/10 px-3 text-xs font-bold text-white",
                  )}
                >
                  Staff
                </Link>
              ) : null}
              <ThemeToggle inverted />
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className={cn(
                  "min-h-10 min-w-10 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20",
                  lowBandwidth && "border-white bg-white text-elma-navy",
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
                    <SheetTitle className="font-extrabold tracking-widest text-white">
                      {isStaff && profile ? roleNavLabel(profile) : "Menu"}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <SiteNav
                      dark
                      orientation="vertical"
                      groups={navGroups}
                      onNavigate={() => setMenuOpen(false)}
                    />
                    {isStaff ? (
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

          <div className="hidden items-center gap-2 lg:flex lg:shrink-0 lg:justify-end">
            <Link
              href={citizenAppNavLink.href}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-10 rounded-full border-white/25 bg-white/10 font-bold text-white hover:bg-white/20",
              )}
            >
              {citizenAppNavLink.label}
            </Link>
            {isStaff && profile ? (
              <span className="hidden rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white lg:inline">
                {roleNavLabel(profile)}
              </span>
            ) : null}
            <ThemeToggle inverted />
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 rounded-full border-white/25 bg-white/10 px-4 font-semibold text-white hover:bg-white/20",
                lowBandwidth && "border-white bg-white text-elma-navy",
              )}
              onClick={toggle}
              aria-pressed={lowBandwidth}
            >
              <WifiOff data-icon="inline-start" />
              Lite
            </Button>
            {isStaff ? (
              <LogoutButton dark />
            ) : (
              <Link
                href="/responder/login"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-10 rounded-full bg-white font-bold text-elma-navy hover:bg-white/90",
                )}
              >
                Staff sign in
              </Link>
            )}
          </div>
        </header>

        <div
          className={cn(
            "flex flex-1 flex-col gap-6",
            isMarketing ? "px-0 py-0" : "elma-glass-panel rounded-[1.75rem] p-5 sm:p-7 lg:p-8",
          )}
        >
          {!hidePageTitle ? <PageTopBar showSearch={false} /> : null}
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
